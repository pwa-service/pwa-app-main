import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import axios, {AxiosError} from 'axios';
import {EventType, LogStatus} from '.prisma/client';
import {EventHandlerRepository} from './event-handler.repository';
import {EventLogProducer} from "../queues/event-log.producer";
import {
  CompleteRegistrationDto,
  FbEventEnum,
  FBPayload,
  PrepareInstallLinkDto,
  PurchaseDto,
  PwaFirstOpenDto,
  SubscribeDto,
  ViewContentDto,
} from "../../../pwa-shared/src";
import * as geo from 'geoip-country'
import {RpcException} from "@nestjs/microservices";
import {status} from '@grpc/grpc-js';
import {FbEventDto} from "../../../pwa-shared/src/types/event-handler/dto/event.dto";
import {PwaSession} from "@prisma/client";
import {InjectMetric} from "@willsoto/nestjs-prometheus";
import {Counter, Histogram} from "prom-client";

const eventMap = new Map<FbEventEnum, EventType>([
  [FbEventEnum.Dep, EventType.Purchase],
  [FbEventEnum.Redep, EventType.Purchase],
  [FbEventEnum.Subscribe, EventType.Subscribe],
  [FbEventEnum.Reg, EventType.CompleteRegistration],
])

class FacebookApiError extends Error {
  fb: string;

  constructor(message: string, fbDetails: any) {
    const fbJson = typeof fbDetails === 'string' ? fbDetails : JSON.stringify(fbDetails);
    super(message);
    this.name = 'FacebookApiError';
    this.fb = fbJson;
    Object.setPrototypeOf(this, FacebookApiError.prototype);
  }
}

@Injectable()
export class EventHandlerCoreService implements OnModuleInit {
  private readonly log = new Logger(EventHandlerCoreService.name);
  private readonly graphVersion = process.env.FB_GRAPH_VERSION ?? 'v21.0';
  private readonly baseGraphUrl = process.env.BASE_GRAPH_URL || 'https://graph.facebook.com'

  constructor(
      private readonly repo: EventHandlerRepository,
      private readonly logs: EventLogProducer,
      @InjectMetric('fb_capi_events_total') public eventsCounter: Counter<string>,
      @InjectMetric('fb_capi_duration_seconds') public durationHistogram: Histogram<string>,
  ) {}

  onModuleInit() {
    this.eventsCounter.labels('Init', 'boot').inc(0);
  }


  async viewContent(event: ViewContentDto) {
    this.log.debug({tag: 'viewContent:input', event});
    const {pixelId, fbclid, offerId, utmSource, clientIp} = event._meta

    if (!pixelId) {
      this.eventsCounter.labels('ViewContent', 'missing_pixel_id').inc();
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'pixel_id is required in DTO body or query string'
      });
    }

    const {id: sessionId} = await this.repo.upsertSession({
      pwaDomain: event.pwaDomain,
      landingUrl: event.landingUrl ?? null,
      queryStringRaw: event.queryStringRaw ?? null,
      pixelId,
      fbclid: fbclid ?? null,
      offerId: offerId ?? null,
      utmSource: utmSource ?? null,
      sub1: undefined,
    });
    const eventName = 'ViewContent';
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: event.landingUrl || `https://${event.pwaDomain}`,
      fbclid,
      offerId,
      utmSource,
      clientIp,
      sessionId,
    });
    this.log.debug({tag: 'viewContent:payload', payload});

    try {
      const fb = await this.sendToFacebookApi(pixelId, sessionId, eventName, payload);
      this.log.log({tag: 'viewContent:fb-response', fb});
      return {success: true, fb, sessionId};
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({tag: 'viewContent:fb-error', error: e.message, fb: e.fb});
        return {success: false, fb: e.fb, sessionId};
      }
      throw e;
    }
  }

  async prepareInstallLink(event: PrepareInstallLinkDto) {
    this.log.debug({tag: 'prepareInstallLink:input', event});
    const {sessionId, pwaDomain} = event;
    const base = process.env.TRACKER_BASE_URL || 'https://tracker.example.com/landing';
    const url = new URL(base);

    url.searchParams.set('session_id', sessionId);
    const finalUrl = url.toString();

    await this.repo.setFinalUrl(sessionId, finalUrl);
    this.log.log({event: 'prepare-install-link', sessionId, pwaDomain, finalUrl});
    return {finalUrl};
  }


  async pwaFirstOpen(event: PwaFirstOpenDto) {
    this.log.debug({tag: 'pwaFirstOpen:input', event});

    const sessionId = event.sessionId
    const sess = await this.repo.getSessionById(sessionId);
    this.log.debug({tag: 'pwaFirstOpen:session', sess});

    if (!sess) {
      this.eventsCounter.labels('Lead', 'session_not_found').inc();
      return {success: true, fb: JSON.stringify({message: 'Session not found for first open.'})};
    }

    const pixelId = sess.pixelId;
    const sourceUrl = sess.finalUrl || sess.landingUrl || `https://${sess.pwaDomain || event.pwaDomain}`;

    const eventName = 'Lead';
    const exists = await this.repo.isSessionEventLogExists(sessionId, eventName);
    if (exists) {
      this.eventsCounter.labels('Lead', 'duplicate').inc();
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'You can not use this session for this type of event'
      });
    }

    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl,
      fbclid: sess.fbclid || undefined,
      offerId: sess.offerId || undefined,
      utmSource: sess.utmSource || undefined,
      clientIp: event._meta.clientIp,
      sessionId,
    });

    this.log.debug({tag: 'pwaFirstOpen:payload', payload});
    const eventId = (payload?.data?.[0] as any)?.event_id as string | undefined;

    let fbResponse: string;
    let success = true;
    try {
      fbResponse = await this.sendToFacebookApi(pixelId, sessionId, eventName, payload);
      this.log.log({tag: 'pwaFirstOpen:fb-response', fb: fbResponse});
    } catch (e: any) {
      success = false;
      if (e instanceof FacebookApiError) {
        this.log.error({tag: 'pwaFirstOpen:fb-error', error: e.message, fb: e.fb});
        fbResponse = e.fb;
      } else {
        this.log.error({tag: 'pwaFirstOpen:unknown-error', error: e.message});
        fbResponse = JSON.stringify({error: e.message});
      }
    }

    await this.repo.markFirstOpen({
      sessionId: event.sessionId,
      eventId: eventId ?? null,
      fbStatus: success ? LogStatus.success : LogStatus.error,
      finalUrl: sourceUrl,
    });
    return {success, fb: fbResponse};
  }

  async event(event: FbEventEnum, dto: FbEventDto) {
    if (event !== FbEventEnum.Redep) {
      const exists = await this.repo.isSessionEventLogExists(dto.sessionId, eventMap.get(event)!);
      if (exists) {
        this.eventsCounter.labels(event, 'duplicate').inc();
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'You can not use this session for this type of event'
        });
      }
    }

    const sessionId = dto.sessionId;
    const sess = await this.repo.getSessionById(sessionId);
    if (!sess) {
      this.eventsCounter.labels(event, 'session_not_found').inc();
      return {success: false, fb: JSON.stringify({message: 'Session not found for.'})};
    }

    const pixelId = sess.pixelId;
    const sourceUrl = sess.finalUrl || sess.landingUrl || `https://${sess.pwaDomain || dto.pwaDomain}`;
    let payload: any
    let eventName: EventType

    switch (event) {
      case FbEventEnum.Reg:
        eventName = 'CompleteRegistration';
        this.eventsCounter.labels(eventName, 'processing_start').inc();
        payload = await this.completeRegistration(dto, sess, eventName, sourceUrl);
        break;

      case FbEventEnum.Redep:
        eventName = 'Purchase';
        this.eventsCounter.labels(eventName, 'processing_redep').inc();
        payload = await this.purchase(dto as PurchaseDto, sess, eventName, sourceUrl);
        break;

      case FbEventEnum.Dep:
        eventName = 'Purchase';
        this.eventsCounter.labels(eventName, 'processing_dep').inc();
        payload = await this.purchase(dto as PurchaseDto, sess, eventName, sourceUrl);
        break;

      case FbEventEnum.Subscribe:
        eventName = 'Subscribe';
        this.eventsCounter.labels(eventName, 'processing_start').inc();
        payload = await this.subscribe(dto as SubscribeDto, sess, eventName, sourceUrl);
        break;

      default:
        this.eventsCounter.labels('Unknown', 'invalid_enum_arg').inc();
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid event name.'
        })
    }

    try {
      const fb = await this.sendToFacebookApi(pixelId, sessionId, eventName, payload);
      this.log.log({tag: `${event}:fb-response`, fb});
      return {success: true, fb};
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({tag: `${event}:fb-error`, error: e.message, fb: e.fb});
        return {success: false, fb: e.fb};
      }
      throw e;
    }
  }

  async completeRegistration(event: CompleteRegistrationDto, sess: PwaSession, eventName: EventType, sourceUrl: string) {
    this.log.debug({tag: 'completeRegistration:input', event});
    const sessionId = sess.id;
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl,
      fbclid: sess.fbclid || undefined,
      offerId: sess.offerId || undefined,
      utmSource: sess.utmSource || undefined,
      clientIp: event._meta.clientIp,
      sessionId,
    });
    this.log.debug({tag: 'completeRegistration:payload', payload});
    return payload
  }

  async purchase(event: PurchaseDto, sess: PwaSession, eventName: EventType, sourceUrl: string) {
    this.log.debug({tag: 'purchase:input', event});

    const sessionId = sess.id;
    const payload = this.payloadFbBuilder({
      eventName: eventName,
      sourceUrl,
      fbclid: sess.fbclid || undefined,
      offerId: sess.offerId || undefined,
      utmSource: sess.utmSource || undefined,
      value: event.value,
      currency: event.currency,
      clientIp: event._meta.clientIp,
      sessionId,
    });
    this.log.debug({tag: 'purchase:payload', payload});
    return payload;
  }

  async subscribe(event: SubscribeDto, sess: PwaSession, eventName: EventType, sourceUrl: string) {
    this.log.debug({tag: 'subscribe:input', event});

    const sessionId = sess.id;
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl,
      fbclid: sess.fbclid || undefined,
      offerId: sess.offerId || undefined,
      utmSource: sess.utmSource || undefined,
      value: event.value,
      currency: event.currency,
      clientIp: event._meta.clientIp,
      sessionId,
    });
    this.log.debug({tag: 'subscribe:payload', payload});
    return payload
  }

  private async sendToFacebookApi(
      pixelId: bigint | number | string,
      sessionId: string,
      eventType: EventType,
      payload: unknown,
  ) {
    const endTimer = this.durationHistogram.startTimer({ event: eventType });
    const pixelToken = await this.repo.findPixelTokenId(pixelId);
    if (!pixelToken) {
      this.eventsCounter.labels(eventType, 'missing_token').inc();
      endTimer({ http_status: '400' });

      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'No token token fond by pixelId'
      });
    }
    const fbToken = pixelToken.token
    const eventId =
        (payload as any)?.data?.[0]?.event_id ??
        (payload as any)?.data?.[0]?.eventId ??
        Math.random().toString(36).slice(2, 12);

    const clientIp = (payload as any)?.data?.[0]?.user_data?.client_ip_address as string | undefined;

    let logStatus: LogStatus = LogStatus.success;
    let responseData: any = null;
    let finalResult: string | FacebookApiError;
    let url = `${this.baseGraphUrl}/${this.graphVersion}/${encodeURIComponent(pixelId as number)}/events`;

    try {
      if (process.env.FB_MOCK === 'true') {
        const mock = {
          events_received: (payload as any)?.data?.length ?? 1,
          fbtrace_id: `MOCK-${Math.random().toString(36).slice(2, 10)}`,
          echo: {pixel_id: pixelId, first_event_id: eventId, version: this.graphVersion},
        };
        this.log.debug({tag: 'fb-capi:mock', mock});
        responseData = mock;
        finalResult = JSON.stringify(mock);
        endTimer({ http_status: '200' });

      } else {
        url = `${url}?access_token=${fbToken}`;
        const {data, status: httpStatus} = await axios.post(url, payload, {
          headers: {'Content-Type': 'application/json'},
          timeout: 7000,
        });
        this.log.log({tag: 'fb-capi', status: httpStatus, fbtrace_id: (data as any)?.fbtrace_id});
        responseData = data;
        finalResult = JSON.stringify(data);

        this.eventsCounter.labels(eventType, 'success').inc();
        endTimer({ http_status: String(httpStatus) });
      }
    } catch (e) {
      logStatus = LogStatus.error;
      let errorMessage: string;
      const err = e as AxiosError;
      let statusCode = 'unknown';

      if (err.response) {
        const {status: httpStatus, data} = err.response;
        statusCode = String(httpStatus);
        this.log.warn({tag: 'fb-capi:response-error', status: httpStatus, body: data});
        responseData = {error: `FB ${httpStatus}: ${JSON.stringify(data)}`};
        errorMessage = `Facebook API Error ${httpStatus}`;
      } else if (axios.isAxiosError(err)) {
        statusCode = 'timeout_or_network';
        this.log.error({tag: 'fb-capi:axios-error', stage: 'axios', error: err.message});
        responseData = {error: `FB request failed: ${err.message}`};
        errorMessage = `Request Failed: ${err.message}`;
      } else {
        this.log.error({tag: 'fb-capi:unknown-error', stage: 'unknown', error: String(e)});
        responseData = {error: String(e)};
        errorMessage = `Unknown Error: ${String(e)}`;
      }

      this.eventsCounter.labels(eventType, 'error').inc();
      endTimer({ http_status: statusCode });

      finalResult = new FacebookApiError(errorMessage, responseData);
    } finally {
      try {
        await this.logs.createLog({
          sessionId,
          pixelId: pixelId as string,
          eventType,
          eventId,
          status: logStatus,
          responseData,
          revenue: null,
          clientIp,
          country: clientIp ? geo.lookup(clientIp)?.country : null,
        });
      } catch (logError) {
        this.log.error({tag: 'db-logging-error', error: logError});
        this.eventsCounter.labels(eventType, 'db_log_error').inc();
      }
    }
    if (finalResult instanceof FacebookApiError) {
      throw finalResult;
    }
    return finalResult;
  }

  private payloadFbBuilder(input: FBPayload) {
    const ts = Number.isFinite(input.eventTime) ? Number(input.eventTime) : Math.floor(Date.now() / 1000);
    const id = input.eventId ?? Math.random().toString(36).slice(2, 12);
    const fbc = input.fbclid ? `fb.1.${ts}.${input.fbclid}` : undefined;
    const fbp = input.fbp ?? `fb.1.${ts}.${Math.floor(Math.random() * 1e12)}`;

    const customBase = {
      content_ids: input.offerId ? [input.offerId] : undefined,
      content_type: input.offerId ? 'product' : undefined,
      content_category: input.utmSource || undefined,
    };

    const monetary =
        'value' in input || 'currency' in input ? {
          value: (input as any).value,
          currency: (input as any).currency
        } : undefined;

    const event = {
      event_name: (input as any).eventName,
      event_time: ts,
      event_id: id,
      action_source: 'website',
      event_source_url: input.sourceUrl,
      user_data: {
        external_id: input.sessionId,
        client_ip_address: input.clientIp,
        client_user_agent: input.userAgent,
        fbc,
        fbp,
      },
      custom_data: {...customBase, ...(monetary ?? {})},
    };

    return {data: [event]};
  }
}
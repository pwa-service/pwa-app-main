import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import {EventType, LogStatus} from '.prisma/client';
import { EventHandlerRepository } from './event-handler.repository';
import {EventLogProducer} from "../queues/event-log.producer";
import {
  CompleteRegistrationDto, FBPayload,
  LeadDto, PrepareInstallLinkDto,
  PurchaseDto,
  PwaFirstOpenDto, SubscribeDto,
  ViewContentDto,
  EventMeta
} from "../../../pwa-shared/src";
import * as geo from 'geoip-country'

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
export class EventHandlerCoreService {
  private readonly log = new Logger(EventHandlerCoreService.name);
  private readonly graphVersion = process.env.FB_GRAPH_VERSION ?? 'v21.0';

  constructor(
      private readonly repo: EventHandlerRepository,
      private readonly logs: EventLogProducer
  ) {}


  async viewContent(event: ViewContentDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'viewContent:input', event });

    const { pixelId, fbclid, offerId, utmSource, clientIp } = event._meta;
    const { id: sessionId } = await this.repo.upsertSession({
      userId: event.userId,
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
      userId: event.userId,
      fbclid,
      offerId,
      utmSource,
      clientIp,
    });
    this.log.debug({ tag: 'viewContent:payload', payload });

    try {
      const fb = await this.sendToFacebookApi(event.userId, pixelId, eventName, payload);
      this.log.log({ tag: 'viewContent:fb-response', fb });
      return { success: true, fb, sessionId };
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'viewContent:fb-error', error: e.message, fb: e.fb });
        return { success: false, fb: e.fb, sessionId: null };
      }
      throw e;
    }
  }

  async prepareInstallLink(event: PrepareInstallLinkDto) {
    this.log.debug({ tag: 'prepareInstallLink:input', event });
    const { userId, pwaDomain } = event;
    const base = process.env.TRACKER_BASE_URL || 'https://tracker.example.com/landing';
    const url = new URL(base);

    url.searchParams.set('user_id', userId);
    const finalUrl = url.toString();

    await this.repo.setFinalUrl(userId, finalUrl);
    this.log.log({ event: 'prepare-install-link', userId, pwaDomain, finalUrl });
    return { finalUrl };
  }


  async pwaFirstOpen(event: PwaFirstOpenDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'pwaFirstOpen:input', event });

    const sess = await this.repo.getSessionById(event.sessionId);
    this.log.debug({ tag: 'pwaFirstOpen:session', sess });
    if (!sess) return

    const sourceUrl =
        sess.finalUrl || sess.landingUrl || `https://${sess.pwaDomain || event.pwaDomain}`;
    const eventName = 'ViewContent'
    const built = this.payloadFbBuilder({
      eventName,
      sourceUrl,
      userId: event.userId,
      fbclid: sess.fbclid || undefined,
      offerId: sess.offerId || undefined,
      utmSource: sess.utmSource || undefined,
      clientIp: event._meta.clientIp
    });

    this.log.debug({ tag: 'pwaFirstOpen:payload', built });
    const eventId = (built?.data?.[0] as any)?.event_id as string | undefined;

    let fbResponse: string;
    let success = true;
    try {
      fbResponse = await this.sendToFacebookApi(event.userId, sess.pixelId, eventName, built);
      this.log.log({ tag: 'pwaFirstOpen:fb-response', fb: fbResponse });
    } catch (e: any) {
      success = false;
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'pwaFirstOpen:fb-error', error: e.message, fb: e.fb });
        fbResponse = e.fb;
      } else {
        this.log.error({ tag: 'pwaFirstOpen:unknown-error', error: e.message });
        fbResponse = JSON.stringify({ error: e.message });
      }
    }

    await this.repo.markFirstOpen({
      userId: event.userId,
      sessionId: event.sessionId,
      eventId: eventId ?? null,
      fbStatus: success ? LogStatus.success : LogStatus.error,
      finalUrl: sourceUrl,
    });
    return { success, fb: fbResponse };
  }

  async lead(dto: LeadDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'lead:input', dto });

    const { pixelId, fbclid, offerId, utmSource, clientIp } = dto._meta;
    const eventName = 'Lead'
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
      clientIp
    });
    this.log.debug({ tag: 'lead:payload', payload });

    try {
      const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, payload);
      this.log.log({ tag: 'lead:fb-response', fb });
      return { success: true, fb };
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'lead:fb-error', error: e.message, fb: e.fb });
        return { success: false, fb: e.fb };
      }
      throw e;
    }
  }

  async completeRegistration(dto: CompleteRegistrationDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'completeRegistration:input', dto });

    const { pixelId, fbclid, offerId, utmSource, clientIp } = dto._meta;
    const eventName = 'CompleteRegistration'
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
      clientIp
    });
    this.log.debug({ tag: 'completeRegistration:payload', payload });

    try {
      const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, payload);
      this.log.log({ tag: 'completeRegistration:fb-response', fb });
      return { success: true, fb };
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'completeRegistration:fb-error', error: e.message, fb: e.fb });
        return { success: false, fb: e.fb };
      }
      throw e;
    }
  }

  async purchase(dto: PurchaseDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'purchase:input', dto });

    const { pixelId, fbclid, offerId, utmSource, clientIp } = dto._meta;
    const eventName = 'Purchase'
    const payload = this.payloadFbBuilder({
      eventName: eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
      value: dto.value,
      currency: dto.currency,
      clientIp
    });
    this.log.debug({ tag: 'purchase:payload', payload });

    try {
      const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, payload);
      this.log.log({ tag: 'purchase:fb-response', fb });
      return { success: true, fb };
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'purchase:fb-error', error: e.message, fb: e.fb });
        return { success: false, fb: e.fb };
      }
      throw e;
    }
  }

  async subscribe(dto: SubscribeDto & { _meta: EventMeta }) {
    this.log.debug({ tag: 'subscribe:input', dto });

    const { pixelId, fbclid, offerId, utmSource, clientIp } = dto._meta;
    const eventName = 'Subscribe'
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
      value: dto.value,
      currency: dto.currency,
      clientIp
    });
    this.log.debug({ tag: 'subscribe:payload', payload });

    try {
      const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, payload);
      this.log.log({ tag: 'subscribe:fb-response', fb });
      return { success: true, fb };
    } catch (e: any) {
      if (e instanceof FacebookApiError) {
        this.log.error({ tag: 'subscribe:fb-error', error: e.message, fb: e.fb });
        return { success: false, fb: e.fb };
      }
      throw e;
    }
  }

  private async sendToFacebookApi(
      userId: string,
      pixelId: string,
      eventType: EventType,
      payload: unknown,
  ) {
    const eventId =
        (payload as any)?.data?.[0]?.event_id ??
        (payload as any)?.data?.[0]?.eventId ??
        Math.random().toString(36).slice(2, 12);

    const clientIp = (payload as any)?.data?.[0]?.user_data?.client_ip_address as string | undefined;
    let status: LogStatus = LogStatus.success;
    let responseData: any = null;
    let finalResult: string | FacebookApiError;

    const url = `https://graph.facebook.com/${this.graphVersion}/${encodeURIComponent(pixelId)}/events`;

    try {
      if (process.env.FB_MOCK) {
        await new Promise((res) => setTimeout(res, 100));
        const mock = {
          events_received: (payload as any)?.data?.length ?? 1,
          fbtrace_id: `MOCK-${Math.random().toString(36).slice(2, 10)}`,
          echo: {pixel_id: pixelId, first_event_id: eventId, version: this.graphVersion},
        };
        this.log.debug({tag: 'fb-capi:mock', mock});
        responseData = mock;
        finalResult = JSON.stringify(mock);
      } else {
        const {data, status: httpStatus} = await axios.post(url, payload, {
          headers: {'Content-Type': 'application/json'},
          timeout: 7000,
        });
        this.log.log({tag: 'fb-capi', status: httpStatus, fbtrace_id: (data as any)?.fbtrace_id});
        responseData = data;
        finalResult = JSON.stringify(data);
      }
    } catch (e) {
      status = LogStatus.error;
      let errorMessage: string;

      const err = e as AxiosError;

      if (err.response) {
        const {status: httpStatus, data} = err.response;
        this.log.warn({tag: 'fb-capi:response-error', status: httpStatus, body: data});
        responseData = {error: `FB ${httpStatus}: ${JSON.stringify(data)}`};
        errorMessage = `Facebook API Error ${httpStatus}`;
      } else if (axios.isAxiosError(err)) {
        this.log.error({tag: 'fb-capi:axios-error', stage: 'axios', error: err.message});
        responseData = {error: `FB request failed: ${err.message}`};
        errorMessage = `Request Failed: ${err.message}`;
      } else {
        this.log.error({tag: 'fb-capi:unknown-error', stage: 'unknown', error: String(e)});
        responseData = {error: String(e)};
        errorMessage = `Unknown Error: ${String(e)}`;
      }
      finalResult = new FacebookApiError(errorMessage, responseData);
    } finally {
      try {
        await this.logs.createLog({
          userId,
          pixelId,
          eventType,
          eventId,
          status,
          responseData,
          revenue: null,
          clientIp,
          country: clientIp ? geo.lookup(clientIp)?.country : null,
        });
      } catch(logError) {
        this.log.error({tag: 'db-logging-error', error: logError});
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
        'value' in input || 'currency' in input ? { value: (input as any).value, currency: (input as any).currency } : undefined;

    console.log("IP", input.clientIp)
    const event = {
      event_name: (input as any).eventName,
      event_time: ts,
      event_id: id,
      action_source: 'website',
      event_source_url: input.sourceUrl,
      user_data: {
        external_id: input.userId,
        client_ip_address: input.clientIp,
        client_user_agent: input.userAgent,
        fbc,
        fbp,
      },
      custom_data: { ...customBase, ...(monetary ?? {}) },
    };

    return { data: [event] };
  }
}
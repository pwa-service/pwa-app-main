import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import {EventType, LogStatus} from '.prisma/client';
import { EventHandlerRepository } from './event-handler.repository';
import {EventLogProducer} from "../queues/event-log.producer";
import {
  CompleteRegistrationDto, FBPayload,
  LeadDto,
  PrepareInstallLinkDto, PurchaseDto,
  PwaFirstOpenDto, SubscribeDto,
  ViewContentDto,
  ViewContentMeta
} from "../../../pwa-shared/src";

@Injectable()
export class EventHandlerCoreService {
  private readonly log = new Logger(EventHandlerCoreService.name);
  private readonly graphVersion = process.env.FB_GRAPH_VERSION ?? 'v21.0';

  constructor(
      private readonly repo: EventHandlerRepository,
      private readonly logs: EventLogProducer
  ) {}

  async viewContent(event: ViewContentDto & { _meta: ViewContentMeta }) {
    this.log.debug({ tag: 'viewContent:input', event });

    const { pixelId, accessToken, fbclid, offerId, utmSource } = event._meta;
    await this.repo.upsertSession({
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
    });
    this.log.debug({ tag: 'viewContent:payload', payload });
    const fb = await this.sendToFacebookApi(event.userId, pixelId, eventName, accessToken, payload);
    this.log.log({ tag: 'viewContent:fb-response', fb });

    return { success: true, fb };
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

  async pwaFirstOpen(event: PwaFirstOpenDto) {
    this.log.debug({ tag: 'pwaFirstOpen:input', event });

    const sess = await this.repo.getSessionByUserId(event.userId);
    this.log.debug({ tag: 'pwaFirstOpen:session', sess });

    if (!sess) return { success: true };

    const accessToken = await this.repo.getActiveAccessTokenByPixelId(sess.pixelId);
    this.log.debug({ tag: 'pwaFirstOpen:accessToken', accessToken });

    if (!accessToken) return { success: true };

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
    });
    this.log.debug({ tag: 'pwaFirstOpen:payload', built });
    const eventId = (built?.data?.[0] as any)?.event_id as string | undefined;

    try {
      const fb = await this.sendToFacebookApi(event.userId, sess.pixelId, eventName, accessToken, built);
      this.log.log({ tag: 'pwaFirstOpen:fb-response', fb });

      await this.repo.markFirstOpen({
        userId: event.userId,
        eventId: eventId ?? null,
        fbStatus: LogStatus.success,
        finalUrl: sourceUrl,
      });

      return { success: true };
    } catch (e: any) {
      this.log.error({ tag: 'pwaFirstOpen:fb-error', error: e.message });

      await this.repo.markFirstOpen({
        userId: event.userId,
        eventId: eventId ?? null,
        fbStatus: LogStatus.error,
        finalUrl: sourceUrl,
      });

      return { success: false, error: e.message };
    }
  }

  async lead(dto: LeadDto & { _meta: ViewContentMeta }) {
    this.log.debug({ tag: 'lead:input', dto });

    const { pixelId, accessToken, fbclid, offerId, utmSource } = dto._meta;
    const eventName = 'Lead'
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
    });
    this.log.debug({ tag: 'lead:payload', payload });

    const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, accessToken, payload);
    this.log.log({ tag: 'lead:fb-response', fb });

    return { status: 'ok' };
  }

  async completeRegistration(dto: CompleteRegistrationDto & { _meta: ViewContentMeta }) {
    this.log.debug({ tag: 'completeRegistration:input', dto });

    const { pixelId, accessToken, fbclid, offerId, utmSource } = dto._meta;
    const eventName = 'CompleteRegistration'
    const payload = this.payloadFbBuilder({
      eventName,
      sourceUrl: dto.landingUrl || `https://${dto.pwaDomain}`,
      userId: dto.userId,
      fbclid,
      offerId,
      utmSource,
    });
    this.log.debug({ tag: 'completeRegistration:payload', payload });

    const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, accessToken, payload);
    this.log.log({ tag: 'completeRegistration:fb-response', fb });

    return { status: 'ok' };
  }

  async purchase(dto: PurchaseDto & { _meta: ViewContentMeta }) {
    this.log.debug({ tag: 'purchase:input', dto });

    const { pixelId, accessToken, fbclid, offerId, utmSource } = dto._meta;
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
    });
    this.log.debug({ tag: 'purchase:payload', payload });

    const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, accessToken, payload);
    this.log.log({ tag: 'purchase:fb-response', fb });

    return { status: 'ok' };
  }

  async subscribe(dto: SubscribeDto & { _meta: ViewContentMeta }) {
    this.log.debug({ tag: 'subscribe:input', dto });

    const { pixelId, accessToken, fbclid, offerId, utmSource } = dto._meta;
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
    });
    this.log.debug({ tag: 'subscribe:payload', payload });

    const fb = await this.sendToFacebookApi(dto.userId, pixelId, eventName, accessToken, payload);
    this.log.log({ tag: 'subscribe:fb-response', fb });

    return { status: 'ok' };
  }

  private async sendToFacebookApi(
      userId: string,
      pixelId: string,
      eventType: EventType,
      accessToken: string,
      payload: unknown,
  ) {
    const eventId =
        (payload as any)?.data?.[0]?.event_id ??
        (payload as any)?.data?.[0]?.eventId ??
        Math.random().toString(36).slice(2, 12);

    const clientIp = (payload as any)?.data?.[0]?.user_data?.client_ip_address as string | undefined;

    let status: LogStatus = LogStatus.success;
    let responseData: any;

    if (process.env.FB_MOCK) {
      await new Promise((res) => setTimeout(res, 100));
      const mock = {
        events_received: (payload as any)?.data?.length ?? 1,
        fbtrace_id: `MOCK-${Math.random().toString(36).slice(2, 10)}`,
        echo: {pixel_id: pixelId, first_event_id: eventId, version: this.graphVersion},
      };
      this.log.debug({tag: 'fb-capi:mock', mock});
      responseData = mock;
      await this.logs.createLog({
        userId,
        pixelId,
        eventType,
        eventId,
        status,
        responseData: mock,
        revenue: null,
        clientIp,
        country: undefined,
      });
      return mock;
    }
    const url = `https://graph.facebook.com/${this.graphVersion}/${encodeURIComponent(pixelId)}/events`;

    try {
      const {data, status: httpStatus} = await axios.post(url, payload, {
        params: {access_token: accessToken},
        headers: {'Content-Type': 'application/json'},
        timeout: 7000,
      });
      this.log.log({tag: 'fb-capi', status: httpStatus, fbtrace_id: (data as any)?.fbtrace_id});
      responseData = data;
      status = LogStatus.success;
      return data;
    } catch (e) {
      status = LogStatus.error;

      const err = e as AxiosError;
      if (err.response) {
        const {status: httpStatus, data} = err.response;
        this.log.warn({tag: 'fb-capi', status: httpStatus, body: data});
        responseData = {error: `FB ${httpStatus}: ${JSON.stringify(data)}`};
        throw new Error(responseData.error);
      }
      if (axios.isAxiosError(err)) {
        this.log.error({tag: 'fb-capi', stage: 'axios', error: err.message});
        responseData = {error: `FB request failed: ${err.message}`};
        throw new Error(responseData.error);
      }
      this.log.error({tag: 'fb-capi', stage: 'unknown', error: String(e)});
      responseData = {error: String(e)};
      throw e;
    } finally {
      await this.logs.createLog({
        userId,
        pixelId,
        eventType,
        eventId,
        status,
        responseData,
        revenue: null,
        clientIp,
        country: undefined,
      });
    }
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

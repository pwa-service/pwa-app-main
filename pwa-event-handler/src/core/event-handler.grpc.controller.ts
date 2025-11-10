import {Controller, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {GrpcMethod, Payload} from '@nestjs/microservices';
import { EventHandlerCoreService } from './event-handler.core.service';
import { ViewContentEnrichmentPipe } from '../pipes/view-content.enrichment.pipe';
import {GrpcClientMetaInterceptor} from "../common/interceptors/grpc-client-meta.interceptor";
import {
  CompleteRegistrationDto,
  LeadDto,
  PrepareInstallLinkDto, PurchaseDto,
  PwaFirstOpenDto, SubscribeDto,
  ViewContentDto,
  EventMeta
} from "../../../pwa-shared/src";
import {SessionExistsPipe} from "../common/interceptors/session.interceptor";

@Controller()
@UseInterceptors(GrpcClientMetaInterceptor)
export class EventHandlerGrpcController {
  constructor(private readonly core: EventHandlerCoreService) {}

  @GrpcMethod('EventHandlerService', 'ViewContent')
  async ViewContent(@Payload(
      ViewContentEnrichmentPipe
    ) dto: ViewContentDto & { _meta: EventMeta }) {
    return this.core.viewContent(dto);
  }

  @GrpcMethod('EventHandlerService', 'PrepareInstallLink')
  PrepareInstallLink(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: PrepareInstallLinkDto) {
    return this.core.prepareInstallLink(dto);
  }

  @GrpcMethod('EventHandlerService', 'PwaFirstOpen')
  PwaFirstOpen(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: PwaFirstOpenDto & { _meta: EventMeta }) {
    return this.core.pwaFirstOpen(dto);
  }

  @GrpcMethod('EventHandlerService', 'Lead')
  Lead(
      @Payload(
          ViewContentEnrichmentPipe,
        SessionExistsPipe
      ) dto: LeadDto & { _meta: EventMeta }) {
    return this.core.lead(dto);
  }

  @GrpcMethod('EventHandlerService', 'CompleteRegistration')
  CompleteRegistration(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: CompleteRegistrationDto & { _meta: EventMeta }) {
    return this.core.completeRegistration(dto);
  }

  @GrpcMethod('EventHandlerService', 'Purchase')
  Purchase(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: PurchaseDto & { _meta: EventMeta }) {
    return this.core.purchase(dto);
  }

  @GrpcMethod('EventHandlerService', 'Subscribe')
  Subscribe(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: SubscribeDto & { _meta: EventMeta }) {
    return this.core.subscribe(dto);
  }
}

import {Controller, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {GrpcMethod, Payload} from '@nestjs/microservices';
import { EventHandlerCoreService } from './event-handler.core.service';
import { ViewContentEnrichmentPipe } from '../pipes/view-content.enrichment.pipe';
import { ViewContentMeta } from '../types/capi.types';
import { ViewContentDto } from '../../../../shared/types/event-handler/dto/view-content.dto';
import { PrepareInstallLinkDto } from '../../../../shared/types/event-handler/dto/prepare-install-link.dto';
import { PwaFirstOpenDto } from '../../../../shared/types/event-handler/dto/first-open.dto';
import {
  LeadDto,
} from '../../../../shared/types/event-handler/dto/lead.dto';
import {CompleteRegistrationDto} from "../../../../shared/types/event-handler/dto/complete-registration.dto";
import {PurchaseDto} from "../../../../shared/types/event-handler/dto/purchase.dto";
import {SubscribeDto} from "../../../../shared/types/event-handler/dto/subscribe.dto";
import {GrpcClientMetaInterceptor} from "../common/interceptors/grpc-client-meta.interceptor";


@Controller()
@UseInterceptors(GrpcClientMetaInterceptor)
export class EventHandlerGrpcController {
  constructor(private readonly core: EventHandlerCoreService) {}

  @GrpcMethod('EventHandlerService', 'ViewContent')
  ViewContent(
      @Payload(
          new ValidationPipe({ whitelist: true, transform: true }),
          ViewContentEnrichmentPipe
      ) dto: ViewContentDto & { _meta: ViewContentMeta }) {
    return this.core.viewContent(dto);
  }

  @GrpcMethod('EventHandlerService', 'PrepareInstallLink')
  PrepareInstallLink(@Payload(
      new ValidationPipe({ whitelist: true, transform: true })
  ) dto: PrepareInstallLinkDto) {
    return this.core.prepareInstallLink(dto);
  }

  @GrpcMethod('EventHandlerService', 'PwaFirstOpen')
  PwaFirstOpen(
      @Payload(
        new ValidationPipe({ whitelist: true, transform: true }),
      ) dto: PwaFirstOpenDto) {
    return this.core.pwaFirstOpen(dto);
  }

  @GrpcMethod('EventHandlerService', 'Lead')
  Lead(
      @Payload(
        new ValidationPipe({ whitelist: true, transform: true }),
        ViewContentEnrichmentPipe
      ) dto: LeadDto & { _meta: ViewContentMeta }) {
    return this.core.lead(dto);
  }

  @GrpcMethod('EventHandlerService', 'CompleteRegistration')
  CompleteRegistration(
      @Payload(
        ViewContentEnrichmentPipe
      ) dto: CompleteRegistrationDto & { _meta: ViewContentMeta }) {
    return this.core.completeRegistration(dto);
  }

  @GrpcMethod('EventHandlerService', 'Purchase')
  Purchase(
      @Payload(
        new ValidationPipe({ whitelist: true, transform: true }),
        ViewContentEnrichmentPipe
      ) dto: PurchaseDto & { _meta: ViewContentMeta }) {
    return this.core.purchase(dto);
  }

  @GrpcMethod('EventHandlerService', 'Subscribe')
  Subscribe(
      @Payload(
        new ValidationPipe({ whitelist: true, transform: true }),
        ViewContentEnrichmentPipe
      ) dto: SubscribeDto & { _meta: ViewContentMeta }) {
    return this.core.subscribe(dto);
  }
}

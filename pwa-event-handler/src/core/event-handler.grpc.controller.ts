import {Controller} from '@nestjs/common';
import {GrpcMethod, Payload} from '@nestjs/microservices';
import { EventHandlerCoreService } from './event-handler.core.service';
import { ViewContentEnrichmentPipe } from '../pipes/view-content.enrichment.pipe';
import {
  PrepareInstallLinkDto,
  PwaFirstOpenDto,
  ViewContentDto,
  EventMeta
} from "../../../pwa-shared/src";
import {SessionExistsPipe} from "../pipes/session.pipe";

@Controller()
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

  @GrpcMethod('EventHandlerService', 'Event')
  Event(
      @Payload(
          ViewContentEnrichmentPipe,
          SessionExistsPipe
      ) dto: any) {
    return this.core.event(dto.eventType, dto);
  }
}

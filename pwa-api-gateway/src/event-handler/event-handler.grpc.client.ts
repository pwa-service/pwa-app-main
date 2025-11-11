import {BadRequestException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Metadata} from '@grpc/grpc-js';
import {lastValueFrom} from 'rxjs';
import {
    CompleteRegistrationDto,
    FbEventEnum, LeadDto,
    PrepareInstallLinkDto, PurchaseDto,
    PwaFirstOpenDto,
    SubscribeDto,
    ViewContentDto
} from "../../../pwa-shared/src";
import {Request} from 'express';
import {FbEventDto} from "../../../pwa-shared/src/types/event-handler/dto/event.dto";

interface EventHandlerService {
    viewContent(data: ViewContentDto, md?: Metadata, opts?: Record<string, any>): any;
    prepareInstallLink(data: PrepareInstallLinkDto, md?: Metadata, opts?: Record<string, any>): any;
    pwaFirstOpen(data: PwaFirstOpenDto, md?: Metadata, opts?: Record<string, any>): any;
    event(data: any, md?: Metadata, opts?: Record<string, any>): any;
}

interface EventRequest {
    lead?: LeadDto;
    completeRegistration?: CompleteRegistrationDto;
    purchase?: PurchaseDto;
    subscribe?: SubscribeDto;
    eventType?: EventRequest;
}

@Injectable()
export class EventHandlerGrpcClient implements OnModuleInit {
    private svc!: EventHandlerService;

    constructor(@Inject('EVENT_HANDLER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<EventHandlerService>('EventHandlerService');
    }

    async viewContent(data: ViewContentDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.viewContent(data, metadata));
    }

    async prepareInstallLink(data: PrepareInstallLinkDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.prepareInstallLink(data, metadata));
    }

    async pwaFirstOpen(data: PwaFirstOpenDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.pwaFirstOpen(data, metadata)) as any;
    }

    async event(req: Request, metadata?: Metadata) {
        const query = req.query
        return await lastValueFrom(this.svc.event({...query, eventType: query.event}, metadata)) as any;
    }
}

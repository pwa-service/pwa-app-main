import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import {
    CompleteRegistrationDto,
    LeadDto,
    PrepareInstallLinkDto, PurchaseDto,
    PwaFirstOpenDto, SubscribeDto,
    ViewContentDto
} from "../../../pwa-shared/src";

interface EventHandlerService {
    viewContent(data: ViewContentDto, md?: Metadata, opts?: Record<string, any>): any;
    prepareInstallLink(data: PrepareInstallLinkDto, md?: Metadata, opts?: Record<string, any>): any;
    pwaFirstOpen(data: PwaFirstOpenDto, md?: Metadata, opts?: Record<string, any>): any;
    lead(data: LeadDto, md?: Metadata, opts?: Record<string, any>): any;
    completeRegistration(data: CompleteRegistrationDto, md?: Metadata, opts?: Record<string, any>): any;
    purchase(data: PurchaseDto, md?: Metadata, opts?: Record<string, any>): any;
    subscribe(data: SubscribeDto, md?: Metadata, opts?: Record<string, any>): any;
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

    async lead(data: LeadDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.lead(data, metadata)) as any;
    }

    async completeRegistration(data: CompleteRegistrationDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.completeRegistration(data, metadata)) as any;
    }

    async purchase(data: PurchaseDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.purchase(data, metadata)) as any;
    }

    async subscribe(data: SubscribeDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.subscribe(data, metadata)) as any;
    }
}

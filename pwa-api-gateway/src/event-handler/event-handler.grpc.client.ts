import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';

interface EventHandlerService {
    viewContent(data: any, md?: Metadata, opts?: Record<string, any>): any;
    prepareInstallLink(data: any, md?: Metadata, opts?: Record<string, any>): any;
    pwaFirstOpen(data: any, md?: Metadata, opts?: Record<string, any>): any;
    lead(data: any, md?: Metadata, opts?: Record<string, any>): any;
    completeRegistration(data: any, md?: Metadata, opts?: Record<string, any>): any;
    purchase(data: any, md?: Metadata, opts?: Record<string, any>): any;
    subscribe(data: any, md?: Metadata, opts?: Record<string, any>): any;
}

@Injectable()
export class EventHandlerGrpcClient implements OnModuleInit {
    private svc!: EventHandlerService;

    constructor(@Inject('EVENT_HANDLER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<EventHandlerService>('EventHandlerService');
    }

    async viewContent(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.viewContent(data, metadata));
    }

    async prepareInstallLink(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.prepareInstallLink(data, metadata));
    }

    async pwaFirstOpen(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.pwaFirstOpen(data, metadata));
    }

    async lead(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.lead(data, metadata));
    }

    async completeRegistration(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.completeRegistration(data, metadata));
    }

    async purchase(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.purchase(data, metadata));
    }

    async subscribe(data: any, metadata?: Metadata) {
        return await lastValueFrom(this.svc.subscribe(data, metadata));
    }
}

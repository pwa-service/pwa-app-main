import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Metadata} from '@grpc/grpc-js';
import {lastValueFrom, Observable} from 'rxjs';
import {
    PwaFirstOpenDto,
    ViewContentDto
} from "../../../pwa-shared/src";
import {Request} from 'express';

interface EventHandlerService {
    ViewContent(data: ViewContentDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    PwaFirstOpen(data: PwaFirstOpenDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    Event(data: any, md?: Metadata, opts?: Record<string, any>): Observable<any>;
}

@Injectable()
export class EventHandlerGrpcClient implements OnModuleInit {
    private svc!: EventHandlerService;

    constructor(@Inject('EVENT_HANDLER_GRPC') private client: ClientGrpc) {}

    onModuleInit() {
        this.svc = this.client.getService<EventHandlerService>('EventHandlerService');
    }

    async viewContent(data: ViewContentDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.ViewContent(data, metadata));
    }


    async pwaFirstOpen(data: PwaFirstOpenDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.PwaFirstOpen(data, metadata)) as any;
    }

    async event(req: Request, metadata?: Metadata) {
        const query = req.query
        return await lastValueFrom(this.svc.Event({...query, sessionId: query.user_id || query.sessionId, eventType: query.event}, metadata)) as any;
    }
}

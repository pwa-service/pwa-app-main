import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventHandlerRepository} from "../core/event-handler.repository";
import { status } from '@grpc/grpc-js';
import {AnyEventDto} from "../../../pwa-shared/src";
import {EventType} from ".prisma/client";


@Injectable()
export class SessionExistsPipe implements PipeTransform<AnyEventDto, any> {
    constructor(private readonly repo: EventHandlerRepository) {}

    async transform(value: AnyEventDto) {
        const { sessionId } = value ?? {};
        if (!sessionId) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: 'sessionId is required'
            });
        }

        const session = await this.repo.getSessionById(sessionId);
        if (!session) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'Session not found'
            });
        }
        return Object.assign(value);
    }
}

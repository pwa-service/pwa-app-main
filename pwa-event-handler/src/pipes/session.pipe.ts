import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventHandlerRepository} from "../../core/event-handler.repository";
import { status } from '@grpc/grpc-js';

type BodyWithSession = { sessionId?: string; userId?: string, eventType?: string };

@Injectable()
export class SessionExistsPipe implements PipeTransform<BodyWithSession, any> {
    constructor(private readonly repo: EventHandlerRepository) {}

    async transform(value: BodyWithSession) {
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

        const isExist = await this.repo.isSessionEventLogExists(sessionId);
        if (!isExist) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: 'You can not use this session for this type of event'
            });
        }

        return Object.assign(value);
    }
}

import { Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {EventHandlerRepository} from "../../core/event-handler.repository";

type BodyWithSession = { sessionId?: string; userId?: string };

@Injectable()
export class SessionExistsPipe implements PipeTransform<BodyWithSession, any> {
    constructor(private readonly repo: EventHandlerRepository) {}

    async transform(value: BodyWithSession) {
        const { sessionId } = value ?? {};
        if (!sessionId) {
            throw new RpcException('sessionId is required');
        }

        const session = await this.repo.getSessionById(sessionId);
        if (!session) {
            throw new RpcException('Session not found');
        }

        return Object.assign(value);
    }
}

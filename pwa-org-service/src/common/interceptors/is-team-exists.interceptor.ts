import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {TeamRepository} from "../../team/team.repository";

@Injectable()
export class IsTeamExistsInterceptor implements NestInterceptor {
    constructor(private readonly repo: TeamRepository) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const rpcContext = context.switchToRpc();
        const data = rpcContext.getData();
        const id = data?.teamId;

        if (id) {
            const entity = await this.repo.findById(id);
            if (!entity) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Team with ID "${id}" not found`,
                });
            }
        }

        return next.handle();
    }
}
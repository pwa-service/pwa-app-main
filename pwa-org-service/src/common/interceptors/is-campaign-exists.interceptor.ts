import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import {CampaignRepository} from "../../campaign/campaign.repository";

@Injectable()
export class IsCampaignExistsInterceptor implements NestInterceptor {
    constructor(private readonly repo: CampaignRepository) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const rpcContext = context.switchToRpc();
        const data = rpcContext.getData();
        const id = data?.campaignId;

        if (id) {
            const entity = await this.repo.findOne(id);
            if (!entity) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Campaign with ID "${id}" not found`,
                });
            }
        }

        return next.handle();
    }
}
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsLeadBelongsToCampaignInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const rpcContext = context.switchToRpc();
        const data = rpcContext.getData();

        const leadId = data?.leadId;
        const campaignId = data?.campaignId;

        if (leadId && campaignId) {
            const campaignMember = await this.prisma.campaignUser.findFirst({
                where: { userProfileId: leadId, campaignId },
            });
            if (!campaignMember) {
                throw new RpcException({
                    code: status.FAILED_PRECONDITION,
                    message: `User "${leadId}" does not belong to campaign "${campaignId}"`,
                });
            }
        }

        return next.handle();
    }
}

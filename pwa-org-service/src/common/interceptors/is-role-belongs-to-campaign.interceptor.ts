import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsRoleBelongsToCampaignInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const rpcContext = context.switchToRpc();
        const data = rpcContext.getData();

        const roleId = data?.roleId;
        const campaignId = data?.campaignId;

        if (roleId !== undefined && roleId !== null && campaignId) {
            const id = typeof roleId === 'string' ? parseInt(roleId) : roleId;
            const role = await this.prisma.role.findUnique({
                where: { id },
                select: { campaignId: true },
            });

            if (role && role.campaignId && role.campaignId !== campaignId) {
                throw new RpcException({
                    code: status.FAILED_PRECONDITION,
                    message: `Role "${roleId}" does not belong to campaign "${campaignId}"`,
                });
            }
        }

        return next.handle();
    }
}

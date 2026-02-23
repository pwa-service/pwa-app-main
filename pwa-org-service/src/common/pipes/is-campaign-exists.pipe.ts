import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsCampaignExists implements PipeTransform {
    constructor(private readonly prisma: PrismaService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;

        const campaignId = value?.campaignId;
        if (campaignId) {
            const campaign = await this.prisma.campaign.findUnique({
                where: { id: campaignId },
            });
            if (!campaign) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Campaign with ID "${campaignId}" not found`,
                });
            }
        }

        return value;
    }
}

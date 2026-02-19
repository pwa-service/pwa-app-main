import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsUserProfileExists implements PipeTransform {
    constructor(private readonly prisma: PrismaService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;

        const userIds = [value?.leadId, value?.userId].filter(Boolean);

        for (const userId of userIds) {
            const profile = await this.prisma.userProfile.findUnique({
                where: { id: userId },
            });
            if (!profile) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `User profile with ID "${userId}" not found`,
                });
            }
        }

        return value;
    }
}

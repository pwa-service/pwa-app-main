import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsDomainExists implements PipeTransform {
    constructor(private readonly prisma: PrismaService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;

        const domainId = value?.domainId;
        if (domainId) {
            const domain = await this.prisma.domain.findUnique({
                where: { id: domainId },
                select: { id: true },
            });
            if (!domain) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Domain with ID "${domainId}" not found`,
                });
            }
        }

        return value;
    }
}

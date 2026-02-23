import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsRoleExists implements PipeTransform {
    constructor(private readonly prisma: PrismaService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;

        const roleId = value?.roleId;
        if (roleId !== undefined && roleId !== null) {
            const id = typeof roleId === 'string' ? parseInt(roleId) : roleId;
            const role = await this.prisma.role.findUnique({
                where: { id },
            });
            if (!role) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Role with ID "${roleId}" not found`,
                });
            }
        }

        return value;
    }
}

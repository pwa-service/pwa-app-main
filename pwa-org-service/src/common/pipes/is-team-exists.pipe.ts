import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { PrismaService } from '../../../../pwa-prisma/src';

@Injectable()
export class IsTeamExists implements PipeTransform {
    constructor(private readonly prisma: PrismaService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value) return value;

        const teamId = value?.teamId;
        if (teamId) {
            const team = await this.prisma.team.findUnique({
                where: { id: teamId },
            });
            if (!team) {
                throw new RpcException({
                    code: status.NOT_FOUND,
                    message: `Team with ID "${teamId}" not found`,
                });
            }
        }

        return value;
    }
}

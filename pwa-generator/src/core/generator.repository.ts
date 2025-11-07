import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../pwa-prisma/src';
import {CreateAppDto} from "../../../pwa-shared/src";
import {Status } from "@prisma/client";


@Injectable()
export class GeneratorRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createApp(data: CreateAppDto) {
        return this.prisma.pwaApp.create({
            data: {
                ...data,
                status: Status.inactive
            }
        });
    }

    async setActive(id: string) {
        await this.prisma.user.update({
            where: { id },
            data: {
                status: Status.active,
            },
        });
    }


    async getAppById(id: string) {
        return this.prisma.pwaApp.findUnique({
            where: { id },
        });
    }
}
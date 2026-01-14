import { Injectable } from '@nestjs/common';
import { PwaStatus } from "@prisma/client";
import {CreateAppDto} from "../../../pwa-shared/src";
import {PrismaService} from "../../../pwa-prisma/src";


@Injectable()
export class PwaManagerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createApp(data: CreateAppDto) {
        return this.prisma.pwaApp.create({
            data: {
                ...data,
                status: PwaStatus.published
            }
        });
    }


    async getAppById(id: string) {
        return this.prisma.pwaApp.findUnique({
            where: { id },
        });
    }
}
import {Body, Controller, Get, HttpCode, Post, Query, Req} from '@nestjs/common';
import { Request } from 'express';
import { EventHandlerGrpcClient } from './event-handler.grpc.client';
import { buildGrpcMetadata } from '../common/jwt-to-metadata';
import {
    PrepareInstallLinkDto,
    PwaFirstOpenDto,
    ViewContentDto
} from "../../../pwa-shared/src";

@Controller('event')
export class EventHandlerHttpController {
    constructor(private readonly pwa: EventHandlerGrpcClient) {}

    @Post('view-content')
    @HttpCode(200)
    async viewContent(@Body() dto: ViewContentDto, @Req() req: Request) {
        return await this.pwa.viewContent(dto, buildGrpcMetadata(req));
    }

    @Post('prepare-install-link')
    @HttpCode(200)
    async prepareInstallLink(@Body() dto: PrepareInstallLinkDto, @Req() req: Request) {
        return await this.pwa.prepareInstallLink(dto, buildGrpcMetadata(req));
    }

    @Post('first-open')
    @HttpCode(200)
    async pwaFirstOpen(@Body() dto: PwaFirstOpenDto, @Req() req: Request) {
        return await this.pwa.pwaFirstOpen(dto, buildGrpcMetadata(req));
    }

    @Get()
    @HttpCode(200)
    async event(@Req() req: Request) {
        return await this.pwa.event(req, buildGrpcMetadata(req));
    }
}

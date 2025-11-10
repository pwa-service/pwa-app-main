import {Body, Controller, Get, HttpCode, Post, Query, Req} from '@nestjs/common';
import { Request } from 'express';
import { EventHandlerGrpcClient } from './event-handler.grpc.client';
import { buildGrpcMetadata } from '../common/jwt-to-metadata';
import {
    CompleteRegistrationDto,
    LeadDto,
    PrepareInstallLinkDto, PurchaseDto,
    PwaFirstOpenDto,
    SubscribeDto,
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

    @Get('lead')
    @HttpCode(200)
    async lead(@Req() req: Request) {
        return await this.pwa.lead(buildGrpcMetadata(req));
    }

    @Get('complete-registration')
    @HttpCode(200)
    async completeRegistration(@Req() req: Request) {
        return await this.pwa.completeRegistration(buildGrpcMetadata(req));
    }

    @Get('purchase')
    @HttpCode(200)
    async purchase( @Req() req: Request) {
        return await this.pwa.purchase(buildGrpcMetadata(req));
    }

    @Get('subscribe')
    @HttpCode(200)
    async subscribe( @Req() req: Request) {
        return await this.pwa.subscribe(buildGrpcMetadata(req));
    }
}

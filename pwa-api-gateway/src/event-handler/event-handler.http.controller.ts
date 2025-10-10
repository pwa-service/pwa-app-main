import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
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

    @Post('lead')
    @HttpCode(200)
    async lead(@Body() dto: LeadDto, @Req() req: Request) {
        return await this.pwa.lead(dto, buildGrpcMetadata(req));
    }

    @Post('complete-registration')
    @HttpCode(200)
    async completeRegistration(@Body() dto: CompleteRegistrationDto, @Req() req: Request) {
        return await this.pwa.completeRegistration(dto, buildGrpcMetadata(req));
    }

    @Post('purchase')
    @HttpCode(200)
    async purchase(@Body() dto: PurchaseDto, @Req() req: Request) {
        return await this.pwa.purchase(dto, buildGrpcMetadata(req));
    }

    @Post('subscribe')
    @HttpCode(200)
    async subscribe(@Body() dto: SubscribeDto, @Req() req: Request) {
        return await this.pwa.subscribe(dto, buildGrpcMetadata(req));
    }
}

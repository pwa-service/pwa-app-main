import {Body, Controller, Get, HttpCode, Post, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { buildGrpcMetadata } from '../common/jwt-to-metadata';
import { AuthGrpcClient } from './auth.grpc.client';
import {
    SignInDto,
    RefreshDto,
    SignUpDto,
    RestorePasswordDto,
    ConfirmEmailDto, RequestRestorePasswordDto
} from '../../../pwa-shared/src';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";
import {TelegramAuthDto} from "../../../pwa-shared/src/types/auth/dto/telegram-auth.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthHttpController {
    constructor(private readonly auth: AuthGrpcClient) {}

    @Post('sign-up')
    @HttpCode(200)
    async signUp(@Body() dto: SignUpDto, @Req() req: Request) {
        return this.auth.signUp(dto, buildGrpcMetadata(req));
    }

    @Post('sign-in')
    @HttpCode(200)
    async signIn(@Body() dto: SignInDto, @Req() req: Request) {
        console.log(req.cookies, req.headers)
        return this.auth.signIn(dto, buildGrpcMetadata(req));
    }


    @Post('refresh')
    @HttpCode(200)
    async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
        return this.auth.refresh(dto, buildGrpcMetadata(req));
    }

    @Post('sign-out')
    @HttpCode(204)
    async signOut(@Req() req: Request) {
        return this.auth.signOut(buildGrpcMetadata(req));
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: Request) {
        return this.auth.me(buildGrpcMetadata(req));
    }

    @Post('request-password-reset')
    @HttpCode(200)
    async requestPasswordReset(@Body() dto: RequestRestorePasswordDto, @Req() req: Request) {
        return this.auth.requestPasswordReset(dto, buildGrpcMetadata(req));
    }

    @Post('restore-password')
    @HttpCode(200)
    async restorePassword(@Body() dto: RestorePasswordDto, @Req() req: Request) {
        return this.auth.restorePassword(dto, buildGrpcMetadata(req));
    }

    @Post('confirm-email')
    @HttpCode(200)
    async confirmEmail(@Body() dto: ConfirmEmailDto, @Req() req: Request) {
        return this.auth.confirmEmail(dto, buildGrpcMetadata(req));
    }

    @Post('telegram')
    @HttpCode(200)
    async telegramAuth(@Body() dto: any, @Req() req: Request) {
        return this.auth.telegramAuth(dto, buildGrpcMetadata(req));
    }
}
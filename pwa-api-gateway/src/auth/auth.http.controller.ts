import {Body, Controller, Get, HttpCode, Post, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { Request } from 'express';
import { buildGrpcMetadata } from '../common/jwt-to-metadata';
import { AuthGrpcClient } from './auth.grpc.client';
import { SignInDto } from '../../../pwa-shared/src/types/auth/dto/sing-in.dto';
import { RefreshDto } from '../../../pwa-shared/src/types/auth/dto/refresh.dto';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {SignUpDto} from "../../../pwa-shared/src/types/auth/dto/sing-up.dto";

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
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
}

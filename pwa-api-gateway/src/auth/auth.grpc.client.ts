import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import {
    SignUpDto,
    RefreshDto,
    SignInDto,
    RestorePasswordDto,
    ConfirmEmailDto,
    RequestRestorePasswordDto
} from "../../../pwa-shared/src";

interface AuthService {
    signUp(data: SignUpDto, md?: Metadata, opts?: Record<string, any>): any;
    signIn(data: SignInDto, md?: Metadata, opts?: Record<string, any>): any;
    refresh(data: RefreshDto, md?: Metadata, opts?: Record<string, any>): any;
    signOut(data: any, md?: Metadata, opts?: Record<string, any>): any;
    requestPasswordReset(data: RequestRestorePasswordDto, md?: Metadata, opts?: Record<string, any>): any;
    restorePassword(data: RestorePasswordDto, md?: Metadata, opts?: Record<string, any>): any;
    confirmEmail(data: ConfirmEmailDto, md?: Metadata, opts?: Record<string, any>): any;
    me(data: any, md?: Metadata, opts?: Record<string, any>): any;
}

@Injectable()
export class AuthGrpcClient {
    private svc!: AuthService;
    constructor(@Inject('AUTH_GRPC') private client: ClientGrpc) {}
    onModuleInit() {
        this.svc = this.client.getService<AuthService>('AuthService');
    }

    async signUp(dto: SignUpDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.signUp(dto, metadata));
    }

    async signIn(dto: SignInDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.signIn(dto, metadata));
    }

    async refresh(dto: RefreshDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.refresh(dto, metadata));
    }

    async signOut(metadata?: Metadata) {
        return await lastValueFrom(this.svc.signOut({}, metadata));
    }

    async requestPasswordReset(dto: RequestRestorePasswordDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.requestPasswordReset(dto, metadata));
    }

    async restorePassword(dto: RestorePasswordDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.restorePassword(dto, metadata));
    }

    async confirmEmail(dto: ConfirmEmailDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.confirmEmail(dto, metadata));
    }

    async me(metadata?: Metadata) {
        return await lastValueFrom(this.svc.me({}, metadata));
    }
}
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import {lastValueFrom, Observable} from 'rxjs';
import {
    SignUpDto,
    RefreshDto,
    SignInDto,
    RestorePasswordDto,
    ConfirmEmailDto,
    RequestRestorePasswordDto
} from "../../../pwa-shared/src";
import {TelegramAuthDto} from "../../../pwa-shared/src/types/auth/dto/telegram-auth.dto";

interface AuthService {
    SignUp(data: SignUpDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    SignIn(data: SignInDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    TelegramAuth(data: TelegramAuthDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    Refresh(data: RefreshDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    SignOut(data: any, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    RequestPasswordReset(data: RequestRestorePasswordDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    RestorePassword(data: RestorePasswordDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    ConfirmEmail(data: ConfirmEmailDto, md?: Metadata, opts?: Record<string, any>): Observable<any>;
    Me(data: any, md?: Metadata, opts?: Record<string, any>): Observable<any>;
}

@Injectable()
export class AuthGrpcClient {
    private svc!: AuthService;
    constructor(@Inject('AUTH_GRPC') private client: ClientGrpc) {}
    onModuleInit() {
        this.svc = this.client.getService<AuthService>('AuthService');
    }

    async signUp(dto: SignUpDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.SignUp(dto, metadata));
    }

    async signIn(dto: SignInDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.SignIn(dto, metadata));
    }

    async refresh(dto: RefreshDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.Refresh(dto, metadata));
    }

    async signOut(metadata?: Metadata) {
        return await lastValueFrom(this.svc.SignOut({}, metadata));
    }

    async requestPasswordReset(dto: RequestRestorePasswordDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.RequestPasswordReset(dto, metadata));
    }

    async restorePassword(dto: RestorePasswordDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.RestorePassword(dto, metadata));
    }

    async confirmEmail(dto: ConfirmEmailDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.ConfirmEmail(dto, metadata));
    }

    async me(metadata?: Metadata) {
        return await lastValueFrom(this.svc.Me({}, metadata));
    }

    async telegramAuth(dto: TelegramAuthDto, metadata?: Metadata) {
        return await lastValueFrom(this.svc.TelegramAuth(dto, metadata));
    }
}
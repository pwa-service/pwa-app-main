import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';
import { RefreshDto } from "../../../../shared/types/auth/dto/refresh.dto";
import {SignInDto} from "../../../../shared/types/auth/dto/sing-in.dto";
import {SignUpDto} from "../../../../shared/types/auth/dto/sing-up.dto";

interface AuthService {
    signUp(data: SignUpDto, md?: Metadata, opts?: Record<string, any>): any;
    signIn(data: SignInDto, md?: Metadata, opts?: Record<string, any>): any;
    refresh(data: RefreshDto, md?: Metadata, opts?: Record<string, any>): any;
    signOut(data: any, md?: Metadata, opts?: Record<string, any>): any;
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

    async me(metadata?: Metadata) {
        return await lastValueFrom(this.svc.me({}, metadata));
    }
}

import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthCoreService } from './auth.core.service';
import { Metadata } from '@grpc/grpc-js';
import {
  SignUpDto,
  SignInDto,
  RefreshDto,
  RestorePasswordDto,
  ConfirmEmailDto,
  RequestRestorePasswordDto
} from "../../../pwa-shared/src";
import {AllowAnonymous} from "../../../pwa-shared/src/modules/auth/decorators/allow-anon.decorator";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";
import {TelegramAuthDto} from "../../../pwa-shared/src/types/auth/dto/telegram-auth.dto";
import {LocalAuthInterceptor} from "../common/interceptors/auth.interceptor";
import {UserPayload} from "../../../pwa-shared/src/types/auth/dto/user-payload.dto";
import {SignUpOrgDto} from "../../../pwa-shared/src/types/auth/dto/sing-up-org.dto";

@Controller()
@UseInterceptors(LocalAuthInterceptor)
export class AuthGrpcController {
  constructor(private readonly auth: AuthCoreService) {}

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'SignUp')
  async signUp(dto: SignUpDto) {
    return this.auth.signUp(dto);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'OrgSignUp')
  async orgSignUp(dto: SignUpOrgDto) {
    return this.auth.orgSignUp(dto);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'SignIn')
  async signIn(dto: SignInDto) {
    const user = await this.auth.validateUser(dto);
    return this.auth.issueTokens(user);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'RequestPasswordReset')
  async requestPasswordReset(dto: RequestRestorePasswordDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'RestorePassword')
  async restorePassword(dto: RestorePasswordDto) {
    return this.auth.restorePassword(dto);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'ConfirmEmail')
  async confirmEmail(dto: ConfirmEmailDto) {
    return this.auth.confirmEmail(dto.token);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: { token: string }) {
    return this.auth.validateToken(data.token);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'Refresh')
  async refresh(dto: RefreshDto) {
    return this.auth.refreshByToken(dto.refreshToken);
  }

  @GrpcMethod('AuthService', 'SignOut')
  async signOut(_empty: {}, md: Metadata, @GrpcUser() user: UserPayload | null) {
    return this.auth.singOut(user?.id);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'TelegramAuth')
  async telegramAuth(dto: TelegramAuthDto) {
    return this.auth.telegramAuth(dto);
  }

  @GrpcMethod('AuthService', 'Me')
  async me(_empty: {}, md: Metadata, @GrpcUser() user: UserPayload | null) {
    return user;
  }
}
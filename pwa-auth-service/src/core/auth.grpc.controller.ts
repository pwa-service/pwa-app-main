import {Controller, UseInterceptors} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthCoreService } from './auth.core.service';
import { Metadata } from '@grpc/grpc-js';
import { SignUpDto, SignInDto, RefreshDto } from "../../../pwa-shared/src";
import {AllowAnonymous} from "../../../pwa-shared/src/modules/auth/decorators/allow-anon.decorator";
import {GrpcAuthInterceptor, UserRecord} from "../../../pwa-shared/src/modules/auth/interceptors/grpc-auth.interceptor";
import {GrpcUser} from "../../../pwa-shared/src/modules/auth/decorators/grpc-user.decorator";

@Controller()
@UseInterceptors(GrpcAuthInterceptor)
export class AuthGrpcController {
  constructor(private readonly auth: AuthCoreService) {}

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'SignUp')
  async signUp(dto: SignUpDto) {
    return this.auth.signUp(dto.email, dto.password, dto.name);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'SignIn')
  async signIn(dto: SignInDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    return this.auth.issueTokens(user);
  }

  @AllowAnonymous()
  @GrpcMethod('AuthService', 'Refresh')
  async refresh(dto: RefreshDto) {
    return this.auth.refreshByToken(dto.refreshToken);
  }

  @GrpcMethod('AuthService', 'SignOut')
  async signOut(_empty: {}, md: Metadata, @GrpcUser() user: UserRecord | null) {
    return this.auth.singOut(user?.id);
  }

  @GrpcMethod('AuthService', 'Me')
  async me(_empty: {}, md: Metadata, @GrpcUser() user: UserRecord | null) {
    return user;
  }
}

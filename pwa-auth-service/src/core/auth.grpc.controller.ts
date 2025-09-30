import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthCoreService } from './auth.core.service';
import { Metadata } from '@grpc/grpc-js';
import { SignUpDto } from "../../../../shared/types/auth/dto/sing-up.dto";
import { SignInDto } from "../../../../shared/types/auth/dto/sing-in.dto";
import { RefreshDto } from "../../../../shared/types/auth/dto/refresh.dto";

@Controller()
export class AuthGrpcController {
  constructor(private readonly auth: AuthCoreService) {}

  @GrpcMethod('AuthService', 'SignUp')
  async signUp(dto: SignUpDto) {
    return this.auth.signUp(dto.email, dto.password, dto.name);
  }

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(dto: SignInDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    return this.auth.issueTokens(user);
  }

  @GrpcMethod('AuthService', 'Refresh')
  async refresh(dto: RefreshDto) {
    return this.auth.refreshByToken(dto.refreshToken);
  }

  @GrpcMethod('AuthService', 'SignOut')
  async signOut(_empty: {}, md: Metadata) {
    return this.auth.signOutFromMd(md);
  }

  @GrpcMethod('AuthService', 'Me')
  async me(_empty: {}, md: Metadata) {
    return this.auth.meFromMd(md);
  }
}

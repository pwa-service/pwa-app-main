import { Module } from '@nestjs/common';
import { AuthGrpcController } from './auth.grpc.controller';
import { AuthCoreService } from './auth.core.service';
import { RefreshStore } from "../common/refresh.store";
import { AuthRepository } from "./auth.repository";
import {PrismaModule} from "../../../../libs/prisma/src";

@Module({
  imports: [PrismaModule],
  controllers: [AuthGrpcController],
  providers: [AuthCoreService, RefreshStore, AuthRepository],
})
export class AuthServiceModule {}

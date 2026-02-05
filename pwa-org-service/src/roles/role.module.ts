import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import {RoleGrpcController} from "./role.grpc.controller";
import {PrismaModule} from "../../../pwa-prisma/src";

@Module({
    imports: [PrismaModule],
    controllers: [RoleGrpcController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}
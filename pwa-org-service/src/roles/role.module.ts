import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import {RoleGrpcController} from "./role.grpc.controller";
import {PrismaModule} from "../../../pwa-prisma/src";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {join} from "path";


const AUTH_PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos')
@Module({
    imports: [
        PrismaModule,
        ClientsModule.register([
            {
                name: 'AUTH_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'auth.v1',
                    protoPath: join(AUTH_PROTO_DIR, 'auth.proto'),
                    url: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
                    loader: {
                        includeDirs: [AUTH_PROTO_DIR],
                        keepCase: false,
                        longs: String,
                        enums: String,
                        defaults: true,
                        oneofs: true,
                    },
                },
            },
        ]),
    ],
    controllers: [RoleGrpcController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}
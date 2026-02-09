import { Module } from '@nestjs/common';
import { SharingGrpcController } from './sharing.grpc.controller';
import { SharingService } from './sharing.service';
import { SharingRepository } from './sharing.repository';
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
    controllers: [SharingGrpcController],
    providers: [SharingService, SharingRepository],
    exports: [SharingService],
})
export class SharingModule {}
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import {OrgModule} from "./core/org.module";

async function bootstrap() {
    const PROTO_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos')
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        OrgModule,
        {
            transport: Transport.GRPC,
            options: {
                package: [
                    'org.campaign',
                    'org.team',
                    'org.member',
                    'org.sharing',
                    'org.role',
                    'org.common'
                ],
                protoPath: [
                    join(PROTO_DIR, 'org/campaign.proto'),
                    join(PROTO_DIR, 'org/team.proto'),
                    join(PROTO_DIR, 'org/member.proto'),
                    join(PROTO_DIR, 'org/role.proto'),
                    join(PROTO_DIR, 'org/common.proto'),
                    join(PROTO_DIR, 'org/sharing.proto'),
                ],
                url: process.env.PWA_ORG_SERVICE_GRPC_URL || '0.0.0.0:50056',
                loader: {
                    includeDirs: [PROTO_DIR],
                    keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true,
                },
            },
        },
    );

    await app.listen();
    console.log('Org Microservice is listening on port 50055');
}
bootstrap();
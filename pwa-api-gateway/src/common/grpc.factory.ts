import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';


const PROTOS_DIR = join(process.env.PROTO_DIR || process.cwd(), 'protos');

export const authClient: ClientProviderOptions = {
    name: 'AUTH_GRPC',
    transport: Transport.GRPC,
    options: {
        package: 'auth.v1',
        protoPath: join(PROTOS_DIR, 'auth.proto'),
        url: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
        loader: {
            includeDirs: [PROTOS_DIR],
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};

export const eventHandlerClient: ClientProviderOptions = {
    name: 'EVENT_HANDLER_GRPC',
    transport: Transport.GRPC,
    options: {
        package: 'event_handler.v1',
        protoPath: join(PROTOS_DIR, 'event_handler.proto'),
        url: process.env.EVENT_HANDLER_GRPC_URL || 'localhost:50053',
        loader: {
            includeDirs: [PROTOS_DIR],
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};

export const appsManager: ClientProviderOptions = {
    name: 'APPS_MANAGER_GRPC',
    transport: Transport.GRPC,
    options: {
        package: 'pwa_apps_manager.v1',
        protoPath: join(PROTOS_DIR, 'pwa-manager', 'pwa_apps_manager.proto'),
        url: process.env.PWA_MANAGER_GRPC_URL || 'localhost:50055',
        loader: {
            includeDirs: [PROTOS_DIR],
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};

export const pixelTokenManager: ClientProviderOptions = {
    name: 'PIXEL_TOKEN_MANAGER_GRPC',
    transport: Transport.GRPC,
    options: {
        package: 'pixel_token.v1',
        protoPath: join(PROTOS_DIR, 'pwa-manager', 'pixel_token_manager.proto'),
        url: process.env.PWA_MANAGER_GRPC_URL || 'localhost:50055',
        loader: {
            includeDirs: [PROTOS_DIR],
            keepCase: false,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};


export const orgClient: ClientProviderOptions = {
    name: 'ORG_SERVICE_GRPC',
    transport: Transport.GRPC,
    options: {
        package: [
            'org.campaign',
            'org.team',
            'org.member',
            'org.role',
            'org.common',
            'org.sharing',
        ],
        protoPath: [
            join(PROTOS_DIR, 'org/campaign.proto'),
            join(PROTOS_DIR, 'org/team.proto'),
            join(PROTOS_DIR, 'org/member.proto'),
            join(PROTOS_DIR, 'org/role.proto'),
            join(PROTOS_DIR, 'org/common.proto'),
            join(PROTOS_DIR, 'org/sharing.proto'),
        ],
        url: process.env.PWA_ORG_SERVICE_GRPC_URL || '0.0.0.0:50056',
        loader: {
            includeDirs: [PROTOS_DIR],
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        },
    },
};


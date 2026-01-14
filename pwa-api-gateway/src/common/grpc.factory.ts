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
        protoPath: join(PROTOS_DIR, 'pwa_apps_manager.proto'),
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
        protoPath: join(PROTOS_DIR, 'pixel_token_manager.proto'),
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


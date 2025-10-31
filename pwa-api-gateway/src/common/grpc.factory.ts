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
        package: 'eventhandler.v1',
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

export const generatorClient: ClientProviderOptions = {
    name: 'GENERATOR_GRPC',
    transport: Transport.GRPC,
    options: {
        package: 'generator.v1',
        protoPath: join(PROTOS_DIR, 'generator.proto'),
        url: process.env.GENERATOR_GRPC_URL || 'localhost:50055',
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


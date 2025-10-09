import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'eventhandler.v1',
      protoPath: join(process.env.PROTO_DIR || process.cwd(), 'protos', 'event_handler.proto'),
      url: process.env.EVENT_HANDLER_GRPC_URL || '0.0.0.0:50053',
      loader: { includeDirs: [join(process.cwd(), 'protos')] },
    },
  });
  await app.listen();
}
bootstrap();

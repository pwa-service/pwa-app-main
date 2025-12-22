import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'eventhandler.v1',
      protoPath: join(process.env.PROTO_DIR || process.cwd(), 'protos', 'event_handler.proto'),
      url: process.env.EVENT_HANDLER_GRPC_URL || '0.0.0.0:50053',
      loader: {
        includeDirs: [join(process.cwd(), 'protos')],
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 4041);
  console.log('Event Handler is running on HTTP:4041 (metrics) and gRPC:50053');
}
bootstrap();
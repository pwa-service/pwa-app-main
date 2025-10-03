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
      protoPath: join(process.cwd(), 'protos', 'event_handler.proto'),
      url: process.env.EVENT_HANDLER_GRPC_URL || '0.0.0.0:50053',
      loader: { includeDirs: [join(process.cwd(), 'protos')] },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4200, '0.0.0.0');
}
bootstrap();

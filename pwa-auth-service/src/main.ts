import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const grpcApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth.v1',
      protoPath: join(process.cwd(), 'protos', 'auth.proto'),
      url: process.env.AUTH_GRPC_URL || '0.0.0.0:50051',
      loader: { includeDirs: [join(process.cwd(), 'protos')] },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000, '0.0.0.0');
}
bootstrap();

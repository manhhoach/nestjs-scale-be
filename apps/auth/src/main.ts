import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get<number>('HTTP_PORT');
  const TCP_PORT = configService.get<number>('TCP_PORT');

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: TCP_PORT },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT);
}
bootstrap();

import { Module } from '@nestjs/common';
import { LoggerModule as LoggerPinoModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerPinoModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}

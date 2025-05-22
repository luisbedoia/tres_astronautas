import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { CustomLogger } from './logger.service';
import { loggerConfig } from './logger.config';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  providers: [
    {
      provide: CustomLogger,
      useFactory: (logger) => new CustomLogger(logger),
      inject: ['winston'],
    },
  ],
  exports: [CustomLogger],
})
export class LoggerModule {}

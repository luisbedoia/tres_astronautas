import { Module } from '@nestjs/common';
import { ProductsModule } from './products.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [DatabaseModule],
  exports: [ProductsService],
})
export class ProductsModule {}

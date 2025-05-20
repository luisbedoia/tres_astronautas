import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { ProducsService } from './products.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProducsService],
})
export class ProductsModule {}

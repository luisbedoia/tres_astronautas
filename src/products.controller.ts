import {
  Body,
  Header,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProducsService } from './products.service';
import { CreateProductDto } from './create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProducsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Body() dto: CreateProductDto,
  ): string {
    return 'Product created';
  }

  @Get()
  getProducts(): string[] {
    return ['product1', 'product2', 'product3'];
  }
}

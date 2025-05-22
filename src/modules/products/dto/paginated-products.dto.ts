import { IsNumber, IsNotEmpty, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDetailDto } from './product-detail.dto';
import { Product } from '../../../domain/entities/product.entity';

export class PaginatedProductsRequestDto {
  @Type(() => Number)
  @ApiProperty({ example: 1, description: 'The page number' })
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @ApiProperty({ example: 10, description: 'The number of products per page' })
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}

export class PaginatedProductsResponseDto {
  products: ProductDetailDto[];
  total: number;
  page: number;
  limit: number;

  static fromProducts(
    products: Product[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedProductsResponseDto {
    return {
      products: products.map(ProductDetailDto.fromProduct),
      total,
      page,
      limit,
    };
  }
}

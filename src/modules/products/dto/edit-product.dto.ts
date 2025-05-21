import { IsString, IsNumber, IsNotEmpty, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EditProductIdDto {
  @ApiProperty({ example: 1, description: 'The id of the product' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}

export class EditProductDto {
  @ApiProperty({ example: 'iPhone 13', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;
}

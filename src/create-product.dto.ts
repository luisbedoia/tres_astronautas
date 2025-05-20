import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name is required' })
  name: string;

  @IsNumber({}, { message: 'The price must be a number' })
  @Min(0, { message: 'The price must be equal or greater than 0' })
  price: number;
}

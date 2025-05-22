import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { Product } from '../../../domain/entities/product.entity';
import { EditProductDto, EditProductIdDto } from '../dto/edit-product.dto';
import { ProductDetailDto } from '../dto/product-detail.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductDetailDto> {
    const product = await this.productsService.create(
      createProductDto.productId,
      createProductDto.name,
      createProductDto.price,
      user.sub,
    );

    return ProductDetailDto.fromProduct(product);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async editProduct(
    @Param() params: EditProductIdDto,
    @Body() editProductDto: EditProductDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductDetailDto> {
    const product = await this.productsService.edit(
      params.id,
      editProductDto.name,
      editProductDto.price,
      user.sub,
    );

    return ProductDetailDto.fromProduct(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a product' })
  @ApiResponse({ status: 200, description: 'Product deactivated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deactivateProduct(
    @Param() params: EditProductIdDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ProductDetailDto> {
    const product = await this.productsService.deactivate(params.id, user.sub);

    return ProductDetailDto.fromProduct(product);
  }
}

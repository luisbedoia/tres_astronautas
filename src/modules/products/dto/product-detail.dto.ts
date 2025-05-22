import { Product } from '../../../domain/entities/product.entity';

export class ProductDetailDto {
  id?: string;
  productId?: number;
  name?: string;
  price?: number;
  ownerId?: string;
  status?: string;

  static fromProduct(product: Product): ProductDetailDto {
    const { id, productId, name, price, ownerId, status } = product.getProps();

    return {
      id,
      productId,
      name,
      price,
      ownerId,
      status,
    };
  }
}

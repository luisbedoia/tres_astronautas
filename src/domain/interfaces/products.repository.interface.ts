import { Product } from '../entities/product.entity';

export interface IProductsRepository {
  save(product: Product): Promise<string>;
  findByProductIdAndOwnerId(
    productId: number,
    ownerId: string,
  ): Promise<Product | null>;
}

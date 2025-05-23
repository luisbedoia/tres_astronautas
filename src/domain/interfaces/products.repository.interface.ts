import { Product } from '../entities/product.entity';

export interface IProductsRepository {
  save(product: Product): Promise<string>;
  update(product: Product): Promise<Product>;
  findByProductIdAndOwnerId(
    productId: number,
    ownerId: string,
  ): Promise<Product | null>;
  findByOwnerId(
    ownerId: string,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }>;
}

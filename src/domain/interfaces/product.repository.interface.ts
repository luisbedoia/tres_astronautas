import { Product } from '../entities/product.entity';

export interface IProductRepository {
  save(product: Product): Promise<string>;
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import { IProductsRepository } from '../../../domain/interfaces/products.repository.interface';
import { IUsersRepository } from '../../../domain/interfaces/users.repository.interface';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: IProductsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(name: string, price: number, ownerId: string): Promise<string> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const product = Product.create(name, price, ownerId);
    return await this.productsRepository.save(product);
  }
}

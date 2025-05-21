import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import { IProductRepository } from '../../../domain/interfaces/product.repository.interface';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async create(name: string, price: number, ownerId: string): Promise<string> {
    const user = await this.userRepository.findById(ownerId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const product = Product.create(name, price, ownerId);
    return await this.productRepository.save(product);
  }
}

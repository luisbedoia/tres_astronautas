import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import { IProductsRepository } from '../../../domain/interfaces/products.repository.interface';
import { IUsersRepository } from '../../../domain/interfaces/users.repository.interface';
import { ICoreService } from '../../../domain/interfaces/core.service.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductsRepository')
    private readonly productsRepository: IProductsRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ICoreService')
    private readonly coreService: ICoreService,
  ) {}

  async create(
    productId: number,
    name: string,
    price: number,
    ownerId: string,
  ): Promise<string> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isValid = await this.coreService.validateProduct(productId, price);
    if (!isValid) {
      throw new BadRequestException('Invalid product price');
    }

    const product = Product.create(productId, name, price, ownerId);
    return await this.productsRepository.save(product);
  }
}

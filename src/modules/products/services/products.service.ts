import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  Product,
  ProductStatus,
} from '../../../domain/entities/product.entity';
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
  ): Promise<Product> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const product = await this.productsRepository.findByProductIdAndOwnerId(
      productId,
      ownerId,
    );
    if (product) {
      throw new ConflictException([
        `productId: ${productId} already exists for the user`,
      ]);
    }

    const isValid = await this.coreService.validateProduct(productId, price);
    if (!isValid) {
      throw new BadRequestException(['Product price must be greater than 10']);
    }

    const newProduct = Product.create(productId, name, price, ownerId);
    const id = await this.productsRepository.save(newProduct);
    newProduct.setId(id);
    return newProduct;
  }

  async edit(
    productId: number,
    newName: string,
    newPrice: number,
    ownerId: string,
  ): Promise<Product> {
    const product = await this.productsRepository.findByProductIdAndOwnerId(
      productId,
      ownerId,
    );
    if (!product) {
      throw new NotFoundException([
        `productId: ${productId} not found for the user`,
      ]);
    }

    const isValid = await this.coreService.validateProduct(productId, newPrice);
    if (!isValid) {
      throw new BadRequestException(['Product price must be greater than 10']);
    }

    product.setName(newName);
    product.setPrice(newPrice);
    product.updateDate();

    await this.productsRepository.update(product);
    return product;
  }

  async deactivate(productId: number, ownerId: string): Promise<Product> {
    const product = await this.productsRepository.findByProductIdAndOwnerId(
      productId,
      ownerId,
    );
    if (!product) {
      throw new NotFoundException([
        `productId: ${productId} already exists for the user`,
      ]);
    }

    product.setStatus(ProductStatus.INACTIVE);
    product.updateDate();
    await this.productsRepository.update(product);
    return product;
  }

  async getProducts(
    page: number,
    limit: number,
    ownerId: string,
  ): Promise<{ products: Product[]; total: number }> {
    const { products, total } = await this.productsRepository.findByOwnerId(
      ownerId,
      page,
      limit,
    );
    return { products, total };
  }
}

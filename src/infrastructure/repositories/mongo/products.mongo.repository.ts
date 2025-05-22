import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IProductsRepository } from '../../../domain/interfaces/products.repository.interface';
import {
  Product,
  ProductStatus,
} from '../../../domain/entities/product.entity';
import { Collection, ObjectId } from 'mongodb';
import { ProductDocument } from './types/product.document';

@Injectable()
export class ProductsMongoRepository implements IProductsRepository {
  private readonly collection = 'products';

  constructor(private readonly dbService: DatabaseService) {}

  private getCollection(): Collection<ProductDocument> {
    return this.dbService.getDb().collection<ProductDocument>(this.collection);
  }

  async save(data: Product): Promise<string> {
    const { id: _, ownerId, ...productData } = data.getProps();
    const doc: ProductDocument = {
      ...productData,
      ownerId: new ObjectId(ownerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.getCollection().insertOne(doc);
    return result.insertedId.toString();
  }

  async findByProductIdAndOwnerId(
    productId: number,
    ownerId: string,
  ): Promise<Product | null> {
    const doc = await this.getCollection().findOne({
      productId,
      ownerId: new ObjectId(ownerId),
    });

    if (!doc) {
      return null;
    }

    return this.mapProduct(doc);
  }

  async findByOwnerId(
    ownerId: string,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const products = await this.getCollection()
      .find({ ownerId: new ObjectId(ownerId) })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await this.getCollection().countDocuments({
      ownerId: new ObjectId(ownerId),
    });

    return {
      products: products.map(this.mapProduct),
      total,
    };
  }

  private mapProduct(product: ProductDocument): Product {
    return Product.fromData({
      id: product._id!.toString(),
      productId: product.productId,
      name: product.name,
      price: product.price,
      ownerId: product.ownerId?.toString(),
      status: product.status as ProductStatus,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}

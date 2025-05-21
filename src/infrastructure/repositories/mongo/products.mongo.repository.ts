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
    const { id: _, ownerId, ...productData } = data;
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

    return Product.fromData({
      id: doc._id.toString(),
      productId: doc.productId,
      name: doc.name,
      price: doc.price,
      ownerId: doc.ownerId.toString(),
      status: doc.status as ProductStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

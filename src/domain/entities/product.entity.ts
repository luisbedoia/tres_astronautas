export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class Product {
  id: string;
  productId: number;
  name: string;
  price: number;
  ownerId: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }

  static create(
    productId: number,
    name: string,
    price: number,
    ownerId: string,
  ): Product {
    return new Product({
      productId,
      name,
      price,
      ownerId,
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(data: Product): Product {
    return new Product({
      id: data.id,
      productId: data.productId,
      name: data.name,
      price: data.price,
      ownerId: data.ownerId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

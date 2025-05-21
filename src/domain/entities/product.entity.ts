export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class Product {
  id: string;
  name: string;
  price: number;
  ownerId: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }

  static create(name: string, price: number, ownerId: string): Product {
    return new Product({
      name,
      price,
      ownerId,
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export interface ProductProps {
  id?: string;
  productId?: number;
  name?: string;
  price?: number;
  ownerId?: string;
  status?: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class Product {
  private id: string;
  private productId: number;
  private name: string;
  private price: number;
  private ownerId: string;
  private status: ProductStatus;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id ?? '';
    this.productId = props.productId ?? 0;
    this.name = props.name ?? '';
    this.price = props.price ?? 0;
    this.ownerId = props.ownerId ?? '';
    this.status = props.status ?? ProductStatus.ACTIVE;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
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
    });
  }

  static fromData(props: ProductProps): Product {
    return new Product({
      id: props.id,
      productId: props.productId,
      name: props.name,
      price: props.price,
      ownerId: props.ownerId,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setPrice(price: number) {
    this.price = price;
  }

  setStatus(status: ProductStatus) {
    this.status = status;
  }

  getProps(): ProductProps {
    return {
      id: this.id,
      productId: this.productId,
      name: this.name,
      price: this.price,
      ownerId: this.ownerId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

import { ObjectId } from 'mongodb';

export interface ProductDocument {
  _id?: ObjectId;
  productId: number;
  name: string;
  price: number;
  status: string;
  ownerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

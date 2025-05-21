import { ObjectId } from 'mongodb';

export interface ProductDocument {
  _id?: ObjectId;
  name: string;
  price: number;
  status: string;
  ownerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

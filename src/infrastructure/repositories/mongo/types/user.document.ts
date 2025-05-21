import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

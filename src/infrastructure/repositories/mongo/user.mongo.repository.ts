import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Collection, ObjectId } from 'mongodb';
import { UserDocument } from './types/user.document';

@Injectable()
export class UserMongoRepository implements IUserRepository {
  private readonly collection = 'users';

  constructor(private readonly dbService: DatabaseService) {}

  private getCollection(): Collection<UserDocument> {
    return this.dbService.getDb().collection<UserDocument>(this.collection);
  }

  async save(data: User): Promise<string> {
    const { id: _, ...userData } = data;
    const doc: UserDocument = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.getCollection().insertOne(doc);
    return result.insertedId.toString();
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.getCollection().findOne({ email });
    if (!doc) return null;

    return User.fromData({
      id: doc._id?.toString() ?? '',
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.getCollection().findOne({ _id: new ObjectId(id) });
    if (!doc) return null;

    return User.fromData({
      id: doc._id?.toString() ?? '',
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

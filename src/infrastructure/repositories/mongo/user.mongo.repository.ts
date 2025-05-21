import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class UserMongoRepository implements IUserRepository {
  private readonly collection = 'users';

  constructor(private readonly dbService: DatabaseService) {}

  async save(data: User): Promise<string> {
    const db = this.dbService.getDb();
    const { id, ...userWithoutId } = data;
    const result = await db.collection(this.collection).insertOne(userWithoutId);

    return result.insertedId.toString();
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.dbService.getDb();
    const user = await db.collection(this.collection).findOne({ email });
    if (!user) return null;

    return User.fromData({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}

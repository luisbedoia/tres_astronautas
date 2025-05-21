import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserMongoRepository implements IUserRepository {
    private readonly collection = 'users';

    constructor(private readonly dbService: DatabaseService) {}

    async findById(id: string): Promise<User | null> {
        const db = this.dbService.getDb();
        const user = await db.collection(this.collection).findOne({ _id: new ObjectId(id) });
        if (!user) return null;
        return new User({
            id: user._id.toString(),
            ...user
        });
    }

    async findOne(filter: Partial<User>): Promise<User | null> {
        const db = this.dbService.getDb();
        const user = await db.collection(this.collection).findOne(filter);
        if (!user) return null;
        return new User({
            id: user._id.toString(),
            ...user
        });
    }

    async findAll(filter?: Partial<User>): Promise<User[]> {
        const db = this.dbService.getDb();
        const users = await db.collection(this.collection).find(filter || {}).toArray();
        return users.map(user => new User({
            id: user._id.toString(),
            ...user
        }));
    }

    async create(data: Partial<User>): Promise<string> {
        const db = this.dbService.getDb();
        const result = await db.collection(this.collection).insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return result.insertedId.toString();
    }

    async update(id: string, data: Partial<User>): Promise<boolean> {
        const db = this.dbService.getDb();
        const result = await db.collection(this.collection).updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: {
                    ...data,
                    updatedAt: new Date()
                }
            }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const db = this.dbService.getDb();
        const result = await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email });
    }
} 
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'tres_astronautas';
    this.client = new MongoClient(uri);
  }

  async onModuleInit() {
    await this.client.connect();
    this.db = this.client.db(process.env.MONGODB_DB_NAME || 'tres_astronautas');
    console.log('Connected to MongoDB');
  }

  async onModuleDestroy() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  getCollection(name: string): Collection {
    return this.db.collection(name);
  }

  getDb(): Db {
    return this.db;
  }
} 
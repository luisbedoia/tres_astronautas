import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { DATABASE_CONFIG } from './database.config';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor(private readonly logger: CustomLogger) {
    this.client = new MongoClient(DATABASE_CONFIG.url, {
      timeoutMS: 2000,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE_CONFIG.dbName);
      this.logger.log('Connected to MongoDB', 'DatabaseService');
    } catch (error) {
      this.logger.error(
        'Failed to connect to MongoDB',
        error instanceof Error ? error.stack : 'Unknown error',
        'DatabaseService',
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('Disconnected from MongoDB', 'DatabaseService');
  }

  getDb(): Db {
    return this.db;
  }
}

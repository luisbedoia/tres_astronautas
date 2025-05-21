import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { DATABASE_CONFIG } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private client: MongoClient;
    private db: Db;

    constructor() {
        this.client = new MongoClient(DATABASE_CONFIG.url);
    }

    async onModuleInit() {
        try {
            await this.client.connect();
            this.db = this.client.db(DATABASE_CONFIG.dbName);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.client.close();
    }

    getDb(): Db {
        return this.db;
    }
} 
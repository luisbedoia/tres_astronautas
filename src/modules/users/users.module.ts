import { Module } from '@nestjs/common';
import { UserMongoRepository } from '../../infrastructure/repositories/mongo/user.mongo.repository';

@Module({
    providers: [
        {
            provide: 'IUserRepository',
            useClass: UserMongoRepository
        }
    ],
    exports: ['IUserRepository']
})
export class UsersModule {} 
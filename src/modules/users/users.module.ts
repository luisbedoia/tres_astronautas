import { Module } from '@nestjs/common';
import { UsersMongoRepository } from '../../infrastructure/repositories/mongo/users.mongo.repository';

@Module({
  providers: [
    {
      provide: 'IUsersRepository',
      useClass: UsersMongoRepository,
    },
  ],
  exports: ['IUsersRepository'],
})
export class UsersModule {}

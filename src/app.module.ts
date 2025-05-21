import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

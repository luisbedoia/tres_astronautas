import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsMongoRepository } from '../../infrastructure/repositories/mongo/products.mongo.repository';
import { UsersModule } from '../users/users.module';
import { CoreService } from '../../infrastructure/external-services/core.service';

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'IProductsRepository',
      useClass: ProductsMongoRepository,
    },
    {
      provide: 'ICoreService',
      useClass: CoreService,
    },
  ],
})
export class ProductsModule {}

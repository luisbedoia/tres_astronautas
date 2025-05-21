import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './infrastructure/database/database.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    // ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

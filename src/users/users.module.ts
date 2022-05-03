import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { User } from '../entities/User';
import { UserController, BestSellersController } from './users.controller';
import { CheckModule } from 'src/checks/check.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CheckModule)],
  providers: [UserService],
  controllers: [UserController, BestSellersController],
  exports: [UserService],
})
export class UserModule {}

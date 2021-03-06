import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { User } from '../entities/User';
import {
  UserController,
  BestSellersController,
  UserCRUDController,
} from './users.controller';
import { CheckModule } from 'src/checks/check.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CheckModule)],
  providers: [UserService],
  controllers: [UserController, BestSellersController, UserCRUDController],
})
export class UserModule {}

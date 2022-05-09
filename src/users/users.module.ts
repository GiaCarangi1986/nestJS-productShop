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
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CheckModule),
    RoleModule,
  ],
  providers: [UserService],
  controllers: [UserController, BestSellersController, UserCRUDController],
  exports: [UserService],
})
export class UserModule {}

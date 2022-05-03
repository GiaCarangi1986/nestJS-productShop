import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckService } from './check.service';
import {
  CheckController,
  CheckAdditionallyController,
} from './check.controller';
import { Check } from '../entities/Check';
import { CheckLineModule } from 'src/checkLines/checkLines.module';
import { BonusCardModule } from 'src/bonusCard/bonusCard.module';
import { UserModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Check]),
    CheckLineModule,
    BonusCardModule,
    UserModule,
    forwardRef(() => ProductsModule),
  ],
  providers: [CheckService],
  controllers: [CheckController, CheckAdditionallyController],
  exports: [CheckService],
})
export class CheckModule {}

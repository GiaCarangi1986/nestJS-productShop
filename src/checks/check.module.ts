import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { Check } from '../entities/Check';
import { CheckLineModule } from 'src/checkLines/checkLines.module';
import { BonusCardModule } from 'src/bonusCard/bonusCard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Check]),
    CheckLineModule,
    BonusCardModule,
  ],
  providers: [CheckService],
  controllers: [CheckController],
})
export class CheckModule {}

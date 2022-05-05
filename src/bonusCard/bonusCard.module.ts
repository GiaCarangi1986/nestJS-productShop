import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusCardService } from './bonusCard.service';
import { BonusCard } from '../entities/BonusCard';
import {
  BonusCardController,
  BonusCardOwnerController,
} from './bonusCard.controller';
import { BonusCardOwnerModule } from 'src/bonusCardOwner/bonusCardOwner.module';

@Module({
  imports: [BonusCardOwnerModule, TypeOrmModule.forFeature([BonusCard])],
  providers: [BonusCardService],
  controllers: [BonusCardController, BonusCardOwnerController],
  exports: [BonusCardService],
})
export class BonusCardModule {}

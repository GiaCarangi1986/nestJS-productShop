import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusCardService } from './bonusCard.service';
import { BonusCard } from '../entities/BonusCard';
import { BonusCardController } from './bonusCard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BonusCard])],
  providers: [BonusCardService],
  controllers: [BonusCardController],
  exports: [BonusCardService],
})
export class BonusCardModule {}

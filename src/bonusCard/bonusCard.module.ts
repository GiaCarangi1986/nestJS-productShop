import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusCardService } from './bonusCard.service';
import { BonusCard } from '../entities/BonusCard';

@Module({
  imports: [TypeOrmModule.forFeature([BonusCard])],
  providers: [BonusCardService],
  controllers: [],
})
export class BonusCardModule {}

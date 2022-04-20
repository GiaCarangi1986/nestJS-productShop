import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusCardOwnerService } from './bonusCardOwner.service';
import { BonusCardOwner } from 'src/entities/BonusCardOwner';

@Module({
  imports: [TypeOrmModule.forFeature([BonusCardOwner])],
  providers: [BonusCardOwnerService],
  controllers: [],
  exports: [BonusCardOwnerService],
})
export class BonusCardOwnerModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckLineService } from './checkLines.service';
import { CheckLine } from 'src/entities/CheckLine';

@Module({
  imports: [TypeOrmModule.forFeature([CheckLine])],
  providers: [CheckLineService],
  controllers: [],
})
export class CheckModule {}

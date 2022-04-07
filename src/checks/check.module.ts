import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { Check } from '../entities/Check';

@Module({
  imports: [TypeOrmModule.forFeature([Check])],
  providers: [CheckService],
  controllers: [CheckController],
})
export class CheckModule {}

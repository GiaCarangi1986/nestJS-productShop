import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WriteOffService } from './writeOff.service';
import { WriteOffAct } from 'src/entities/WriteOffAct';
import { WriteOffController } from './writeOff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WriteOffAct])],
  providers: [WriteOffService],
  controllers: [WriteOffController],
})
export class WriteOffModule {}

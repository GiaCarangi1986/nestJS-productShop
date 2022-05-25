import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementUnitsService } from './measurementUnits.service';
import { MeasurementUnits } from 'src/entities/MeasurementUnits';
import { MeasurementUnitsSelectController } from './measurementUnits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnits])],
  providers: [MeasurementUnitsService],
  controllers: [MeasurementUnitsSelectController],
})
export class MeasurementUnitsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasurementUnits } from 'src/entities/MeasurementUnits';

@Injectable()
export class MeasurementUnitsService {
  constructor(
    @InjectRepository(MeasurementUnits)
    private measurementUnitsRepository: Repository<MeasurementUnits>,
  ) {}

  async getAllForSelect() {
    const measurementUnits = await this.measurementUnitsRepository.find({
      order: { title: 'ASC' },
    });
    const serData = [];
    for (const measurementUnit of measurementUnits) {
      serData.push({
        id: measurementUnit.id,
        title: measurementUnit.title,
      });
    }
    return serData;
  }
}

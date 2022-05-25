import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MeasurementUnitsService } from './measurementUnits.service';

@Controller('measurement_units_select')
export class MeasurementUnitsSelectController {
  constructor(
    private readonly measurementUnitsSelectService: MeasurementUnitsService,
  ) {}

  @Get()
  async getAllForSelect() {
    return this.measurementUnitsSelectService.getAllForSelect().catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }
}

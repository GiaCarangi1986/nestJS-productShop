import { Category } from 'src/entities/Category';
import { Manufacturer } from 'src/entities/Manufacturer';
import { MeasurementUnits } from 'src/entities/MeasurementUnits';
import { Sale } from 'src/entities/Sale';

export class CreateProductDto {
  readonly title: string;
  readonly priceNow: number;
  readonly expirationDate: number | null;
  readonly maybeOld: boolean;
  readonly categoryFK: number;
  readonly measurementUnitsFK: number;
  readonly manufacturerFK: number;
}

export class CreateProductDBDto {
  readonly title: string;
  readonly priceNow: number;
  readonly count: number;
  readonly expirationDate: number | null;
  readonly maybeOld: boolean;
  readonly categoryFK: Category;
  readonly measurementUnitsFK: MeasurementUnits;
  readonly manufacturerFK: Manufacturer;
  readonly isArchive: boolean;
  readonly saleFK: null | Sale;
}

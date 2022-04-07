import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/product.module';
import { CheckModule } from './checks/check.module';

import { Check } from './entities/Check';
import { BonusCard } from './entities/BonusCard';
import { BonusCardOwner } from './entities/BonusCardOwner';
import { Gender } from './entities/Gender';
import { User } from './entities/User';
import { Role } from './entities/Role';
import { WriteOffAct } from './entities/WriteOffAct';
import { Product } from './entities/Product';
import { CheckLine } from './entities/CheckLine';
import { DeliveryLine } from './entities/DeliveryLine';
import { Delivery } from './entities/Delivery';
import { Category } from './entities/Category';
import { MeasurementUnits } from './entities/MeasurementUnits';
import { Sale } from './entities/Sale';
import { SaleKinds } from './entities/SaleKinds';
import { Manufacturer } from './entities/Manufacturer';

@Module({
  imports: [
    ProductsModule,
    CheckModule,
    TypeOrmModule.forFeature([
      BonusCard,
      BonusCardOwner,
      Gender,
      User,
      Role,
      WriteOffAct,
      Product,
      CheckLine,
      DeliveryLine,
      Delivery,
      Category,
      MeasurementUnits,
      Sale,
      SaleKinds,
      Manufacturer,
    ]),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 58099,
      username: 'admin',
      password: 'admin',
      database: 'ProductShop',
      entities: [
        Check,
        BonusCard,
        BonusCardOwner,
        Gender,
        User,
        Role,
        WriteOffAct,
        Product,
        CheckLine,
        DeliveryLine,
        Delivery,
        Category,
        MeasurementUnits,
        Sale,
        SaleKinds,
        Manufacturer,
      ],
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

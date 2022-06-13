import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WriteOffService } from './writeOff.service';
import { WriteOffAct } from 'src/entities/WriteOffAct';
import { WriteOffController } from './writeOff.controller';
import { ProductsModule } from 'src/products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([WriteOffAct]), ProductsModule],
  providers: [WriteOffService],
  controllers: [WriteOffController],
})
export class WriteOffModule {}

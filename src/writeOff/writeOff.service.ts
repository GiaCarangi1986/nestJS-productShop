import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { WriteOffAct } from 'src/entities/WriteOffAct';
import { WriteOffDto, WriteOffDBDto } from './dto/writeoff.dto';

import { ProductService } from 'src/products/products.service';
import { UpdateCountProductDto } from 'src/products/dto/updateCount-product.dto';

import { User } from 'src/entities/User';

@Injectable()
export class WriteOffService {
  constructor(
    @InjectRepository(WriteOffAct)
    private writeOffRepository: Repository<WriteOffAct>,
    private readonly productService: ProductService,
  ) {}

  async findLast(): Promise<Date> {
    const data = await this.writeOffRepository.find();
    return data[data.length - 1]?.dateTimeWriteOff || null;
  }

  async writeOffProducts(data: WriteOffDto) {
    const products: UpdateCountProductDto[] = [];
    for (const product of data.productList) {
      const data = await this.productService.deltaCount(
        +product.productFK,
        product.productCount,
        'списать',
      );
      products.push(data);
    }
    await this.productService.updateArr(products);

    const userRep = getRepository(User);
    const user = await userRep.findOne(data.userFK);

    for (const product of data.productList) {
      const productData = await this.productService.getById(product.productFK);

      const line: WriteOffDBDto = new WriteOffAct();
      line.dateTimeWriteOff = data.dateTimeWriteOff;
      line.userFK = user;
      line.productFK = productData;
      line.productCount = product.productCount;

      await this.writeOffRepository.save(line);
    }
  }
}

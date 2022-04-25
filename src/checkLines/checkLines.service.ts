import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CheckLineCreateDto } from './dto/create-checkLine.dto';
import { CheckLine } from '../entities/CheckLine';

@Injectable()
export class CheckLineService {
  constructor(
    @InjectRepository(CheckLine)
    private checkLineRepository: Repository<CheckLine>,
  ) {}

  async getAllByCheckId(checkFK: number): Promise<CheckLine[]> {
    const checkLines = await this.checkLineRepository.find({
      where: { checkFK },
    });
    return checkLines;
  }

  async createCheckLinesArr(checkLineArray: CheckLineCreateDto[]) {
    for (const line of checkLineArray) {
      await this.checkLineRepository.save(line);
    }
  }

  async deleteArr(idArr: Array<number>) {
    for (const id of idArr) {
      await this.checkLineRepository.delete(id);
    }
  }

  async updateOne(checkLine: CheckLine) {
    await this.checkLineRepository.update(checkLine.id, {
      productCount: checkLine.productCount,
      oldProduct: checkLine.oldProduct,
    });
  }
}

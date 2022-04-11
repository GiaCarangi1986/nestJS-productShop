import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    checkLineArray.forEach(async (line) => {
      await this.checkLineRepository.save(line);
    });
  }

  async deleteOne(id: number) {
    await this.checkLineRepository.delete(id);
  }

  async updateOne(checkLine: CheckLine) {
    await this.checkLineRepository.update(checkLine.id, {
      productCount: checkLine.productCount,
      oldProduct: checkLine.oldProduct,
    });
  }
}

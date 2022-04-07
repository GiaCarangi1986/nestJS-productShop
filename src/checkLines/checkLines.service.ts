import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklLineCreateDto } from './dto/create-checkLine.dto';
import { CheckLine } from '../entities/CheckLine';

@Injectable()
export class CheckLineService {
  constructor(
    @InjectRepository(CheckLine)
    private checkLineRepository: Repository<CheckLine>,
  ) {}

  async getAllByCheckId(checkFk: number): Promise<CheckLine[]> {
    const checkLines = await this.checkLineRepository.find();
    return checkLines.filter((line) => line.checkFk.id === checkFk);
  }

  async createCheckLinesArr(checkLineArray: ChecklLineCreateDto[]) {
    checkLineArray.forEach(async (line) => {
      this.checkLineRepository.create(line);
    });
  }
}

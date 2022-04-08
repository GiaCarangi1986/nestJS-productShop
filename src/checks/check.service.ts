import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { CreateTableCheckDto } from './dto/createTable-check.dto';
import { Check } from '../entities/Check';

import { BonusCardService } from 'src/bonusCard/bonusCard.service';
import { UpdateBonusCardDto } from 'src/bonusCard/dto/update-bonusCard.dto';

import { CheckLineService } from 'src/checkLines/checkLines.service';
import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';
import { CheckTableLineCreateDto } from 'src/checkLines/dto/createTable-checkLine.dto';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
    private readonly bonusCardService: BonusCardService,
    private readonly checkLineService: CheckLineService,
  ) {}

  async getAll(): Promise<Check[]> {
    return this.checkRepository.find();
  }

  async create(product: CreateCheckDto) {
    const bonusCard: UpdateBonusCardDto = {
      bonusCount: product.bonusCount,
      id: product.bonusCardId,
    };
    this.bonusCardService.updateBonusCard(bonusCard);

    const check: CreateTableCheckDto = {
      bonusCount: product.bonusCount,
      bonusCardId: product.bonusCardId,
      changedCheck: product.changedCheck,
      dateTime: product.dateTime,
      userId: product.userId,
      paid: product.paid,
      parentCheckId: product.parentCheck,
      totalSum: product.totalSum,
    };
    let createdCheck = this.checkRepository.create(check);
    createdCheck = await this.checkRepository.save(createdCheck);

    const checkLines: CheckLineCreateDto[] = [];
    product.checkLines.map((line: CheckTableLineCreateDto) => {
      const updatedLine: CheckLineCreateDto = {
        ...line,
        checkId: createdCheck.id,
      };
      checkLines.push(updatedLine);
    });
    this.checkLineService.createCheckLinesArr(checkLines);

    return product;
  }
}

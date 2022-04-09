import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { CreateTableCheckDto } from './dto/createTable-check.dto';
import { Check } from '../entities/Check';
import { BonusCard } from '../entities/BonusCard';
import { User } from '../entities/User';

import { BonusCardService } from 'src/bonusCard/bonusCard.service';
import { UpdateBonusCardDto } from 'src/bonusCard/dto/update-bonusCard.dto';

import { CheckLineService } from 'src/checkLines/checkLines.service';
import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';
import { CheckTableLineCreateDto } from 'src/checkLines/dto/createTable-checkLine.dto';

import { UserService } from 'src/users/users.service';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
    private readonly bonusCardService: BonusCardService,
    private readonly checkLineService: CheckLineService,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<Check[]> {
    return this.checkRepository.find();
  }

  async updateEdited() {}

  async create(checkData: CreateCheckDto) {
    let bonusCard: BonusCard = null;

    if (checkData.bonusCardFK) {
      const bonusCardForUpdate: UpdateBonusCardDto = {
        bonusCount: checkData.totalSum
          ? Math.round((checkData.totalSum / 100) * 100) / 100
          : 0,
        id: checkData.bonusCardFK,
      };
      this.bonusCardService.update(bonusCardForUpdate);

      this.bonusCardService
        .findById(checkData.bonusCardFK)
        .then((res) => (bonusCard = res));
    }

    let user: User;
    this.userService.findById(checkData.userFK).then((res) => (user = res));

    const check: CreateTableCheckDto = {
      bonusCount: checkData.bonusCount,
      bonusCardFK: bonusCard,
      changedCheck: checkData.changedCheck,
      dateTime: new Date(checkData.dateTime),
      userFK: user,
      paid: checkData.paid,
      parentCheckId: null,
      totalSum: checkData.totalSum,
    };
    let createdCheck = this.checkRepository.create(check);
    createdCheck = await this.checkRepository.save(createdCheck);

    const checkLines: CheckLineCreateDto[] = [];
    checkData.checkLines.forEach((line: CheckTableLineCreateDto) => {
      // я хз, мб надо еще Product где то доставать тащить
      const updatedLine: CheckLineCreateDto = {
        ...line,
        checkFK: createdCheck,
      };
      checkLines.push(updatedLine);
    });
    this.checkLineService.createCheckLinesArr(checkLines);

    return checkData;
  }
}

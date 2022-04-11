import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { CreateTableCheckDto } from './dto/createTable-check.dto';
import { UpdateEditedCheckDto } from './dto/updateEdited-check.dto';
import { Check } from '../entities/Check';
import { BonusCard } from '../entities/BonusCard';
import { User } from '../entities/User';

import { BonusCardService } from 'src/bonusCard/bonusCard.service';

import { CheckLineService } from 'src/checkLines/checkLines.service';
import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';
import { CheckTableLineCreateDto } from 'src/checkLines/dto/createTable-checkLine.dto';

import { UserService } from 'src/users/users.service';
import { CheckLine } from 'src/entities/CheckLine';

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

  async updateEdited(id: number, data: UpdateEditedCheckDto) {
    const newCheck: Check = await this.checkRepository.findOne({
      where: { id: data.parentCheckId },
    });

    await this.checkRepository.update(id, {
      parentCheckId: newCheck,
      changedCheck: true,
    });

    return id;
  }

  async create(checkData: CreateCheckDto) {
    // надо еще в поставках убирать
    let bonusCard: BonusCard = null;

    if (checkData.bonusCardFK) {
      await this.bonusCardService.update(
        checkData.bonusCardFK,
        checkData.totalSum
          ? Math.round((checkData.totalSum / 100) * 100) / 100
          : 0,
        checkData.bonusCount,
      );

      bonusCard = await this.bonusCardService.findById(checkData.bonusCardFK);
    }

    const user: User = await this.userService.findById(checkData.userFK);

    const check: CreateTableCheckDto = new Check();
    check.bonusCount = checkData.bonusCount;
    check.bonusCardFK = bonusCard;
    check.changedCheck = checkData.changedCheck;
    check.dateTime = new Date(checkData.dateTime);
    check.userFK = user;
    check.paid = checkData.paid;
    check.parentCheckId = null;
    check.totalSum = checkData.totalSum;

    const createdCheck = await this.checkRepository.save(check);

    const checkLines: CheckLineCreateDto[] = [];
    checkData.checkLines.forEach((line: CheckTableLineCreateDto) => {
      const updatedLine: CheckLineCreateDto = {
        ...line,
        checkFK: createdCheck,
      };
      checkLines.push(updatedLine);
    });
    await this.checkLineService.createCheckLinesArr(checkLines);

    return check;
  }

  async updatePaid(id: number, data: CreateCheckDto) {
    const check: Check = await this.checkRepository.findOne(id);

    if (!check) {
      return `Не существует чека с id=${id}`;
    }

    const checkLines: CheckLine[] = await this.checkLineService.getAllByCheckId(
      check.id,
    );

    if (checkLines.length === 0) {
      return `В чеке с id=${id} отсутсвуют данные`;
    }

    for (let i = 0; i < checkLines.length; i++) {
      let contains = false;
      let j;
      for (j = 0; j < data.checkLines.length; j++) {
        if (checkLines[i].id === data.checkLines[j].id) {
          contains = true;
          break;
        }
      }
      if (!contains) {
        await this.checkLineService.deleteOne(checkLines[i].id);
      } else {
        await this.checkLineService.updateOne(data.checkLines[j]);
      }
    }

    await this.checkRepository.update(check.id, {
      totalSum: data.totalSum,
      dateTime: data.dateTime,
      paid: data.paid,
    });

    return 'success';
  }

  async delete(id: number) {
    const checkLines: CheckLine[] = await this.checkLineService.getAllByCheckId(
      id,
    );

    checkLines.forEach(async (line) => {
      await this.checkLineService.deleteOne(line.id);
    });

    await this.checkRepository.delete(id);
    return id;
  }
}

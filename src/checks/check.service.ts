import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { CreateTableCheckDto } from './dto/createTable-check.dto';
import { Check } from '../entities/Check';
import { BonusCard } from '../entities/BonusCard';
import { User } from '../entities/User';

import { BonusCardService } from 'src/bonusCard/bonusCard.service';

import { CheckLineService } from 'src/checkLines/checkLines.service';
import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';

import { UserService } from 'src/users/users.service';
import { CheckLine } from 'src/entities/CheckLine';

import { DeliveryLineService } from 'src/deliveryLine/deliveryLine.service';
import { UpdateCountDeliveryLineDto } from 'src/deliveryLine/dto/updateCount-deliveryLine.dto';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
    private readonly bonusCardService: BonusCardService,
    private readonly checkLineService: CheckLineService,
    private readonly userService: UserService,
    private readonly deliveryLineService: DeliveryLineService,
  ) {}

  async getAll(): Promise<Check[]> {
    return this.checkRepository.find();
  }

  async create(checkData: CreateCheckDto) {
    let prevCheck: Check = null;

    await (async () => {
      if (checkData.changedCheck) {
        const deliveryLines: UpdateCountDeliveryLineDto[] = [];
        /*
          Тут надо тоже выбросить ошибку, если нет чека с таким checkData.parentCheckId
        */
        prevCheck = await this.checkRepository.findOne(checkData.parentCheckId);
        if (!prevCheck) {
          throw {
            message: `Чека с id = ${checkData.parentCheckId} не существует`,
          };
        }

        if (!prevCheck.changedCheck) {
          await this.checkRepository.update(prevCheck.id, {
            changedCheck: true,
          });
        }

        const checkLines: CheckLine[] =
          await this.checkLineService.getAllByCheckId(prevCheck.id);

        let error = '';

        for (const line of checkLines) {
          const data = await this.deliveryLineService.deltaCount(
            +line.productFK.id,
            -1 * line.productCount,
          );
          if (data.error) {
            error = data.error;
            break;
          } else {
            deliveryLines.push(data);
          }
        }
        if (error) {
          return error;
        }

        await this.deliveryLineService.updateArr(deliveryLines);
      }
    })();

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
    check.parentCheckId = prevCheck;
    check.totalSum = checkData.totalSum;

    const createdCheck = await this.checkRepository.save(check);

    const checkLines: CheckLineCreateDto[] = [];
    const deliveryLines: UpdateCountDeliveryLineDto[] = [];
    let errorCount = false;
    let index: number;

    for (index = 0; index < checkData.checkLines.length; index++) {
      const updatedLine = {
        ...checkData.checkLines[index],
        checkFK: createdCheck,
      };
      checkLines.push(updatedLine);

      deliveryLines.push(
        await this.deliveryLineService.deltaCount(
          +updatedLine.productFK,
          updatedLine.productCount,
        ),
      );

      if (deliveryLines[index].error) {
        errorCount = true;
        break;
      }
    }
    if (errorCount) {
      return deliveryLines[index].error;
    } else {
      await this.deliveryLineService.updateArr(deliveryLines);
    }
    await this.checkLineService.createCheckLinesArr(checkLines);

    return check;
  }

  async delete(
    id: number,
    needUpdateDeliveryLines: Boolean = false,
    isCheckDelay: Boolean = false,
  ) {
    const checkLines: CheckLine[] = await this.checkLineService.getAllByCheckId(
      id,
    );

    if (!checkLines.length) {
      return `Нет чека с id = ${id}`;
    }

    const deliveryLines: UpdateCountDeliveryLineDto[] = [];
    const deleteLines: Array<number> = [];

    for (const line of checkLines) {
      if (needUpdateDeliveryLines && !isCheckDelay) {
        const data = await this.deliveryLineService.deltaCount(
          +line.productFK.id,
          -1 * line.productCount,
        );
        deliveryLines.push(data);
      }

      deleteLines.push(line.id);
    }

    if (needUpdateDeliveryLines && !isCheckDelay) {
      await this.deliveryLineService.updateArr(deliveryLines);
    }
    await this.checkLineService.deleteArr(deleteLines);

    await this.checkRepository.delete(id);

    return id;
  }
}

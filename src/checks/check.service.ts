import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CreateCheckDto } from './dto/create-check.dto';
import { CreateTableCheckDto } from './dto/createTable-check.dto';
import { GetAllChecksDto } from './dto/getAll-check.dto';
import { WhereCheckDto } from './dto/where.dto';
import { Check } from '../entities/Check';
import { BonusCard } from '../entities/BonusCard';
import { User } from '../entities/User';
import { serializerCheckForDB } from './check.serializer';

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

  async getAll({
    page,
    pageSize,
    delayedShow = false,
    changedShow = false,
    dateStart,
    dateEnd,
  }: GetAllChecksDto) {
    const where: WhereCheckDto = {
      dateTime: Raw((date) => `${date} >= :dateStart AND ${date} <= :dateEnd`, {
        dateStart,
        dateEnd,
      }),
      parentCheckId: null,
      // dateTime: MoreThanOrEqual(dateStart) && LessThanOrEqual(dateEnd),
    };
    if (changedShow) {
      where.changedCheck = changedShow;
    }
    if (delayedShow) {
      where.paid = !delayedShow;
    }

    const [results, count] = await this.checkRepository.findAndCount({
      where,
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    let serResult = [];
    for (const check of results) {
      const serCheck = await serializerCheckForDB(check);
      serResult.push(serCheck);
    }

    return {
      results: serResult,
      count,
      next: count > results.length,
    };
  }

  async create(checkData: CreateCheckDto) {
    let prevCheck: Check = null;

    await (async () => {
      if (checkData.changedCheck) {
        const deliveryLines: UpdateCountDeliveryLineDto[] = [];
        prevCheck = await this.checkRepository.findOne(checkData.parentCheckId);
        if (!prevCheck) {
          throw {
            message: `Чека с id = ${checkData.parentCheckId} не существует`,
          };
        }

        const checkLines: CheckLine[] =
          await this.checkLineService.getAllByCheckId(prevCheck.id);

        for (const line of checkLines) {
          const data = await this.deliveryLineService.deltaCount(
            +line.productFK.id,
            -1 * line.productCount,
          );
          deliveryLines.push(data);
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
    check.parentCheckId = null;
    check.totalSum = checkData.totalSum;

    const createdCheck = await this.checkRepository.save(check);

    if (checkData.changedCheck) {
      await this.checkRepository.update(prevCheck.id, {
        changedCheck: true,
        parentCheckId: createdCheck,
      });
    }

    const checkLines: CheckLineCreateDto[] = [];
    const deliveryLines: UpdateCountDeliveryLineDto[] = [];
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
    }

    await this.deliveryLineService.updateArr(deliveryLines);
    await this.checkLineService.createCheckLinesArr(checkLines);

    return check;
  }

  async treeDeleteCheck(id: number) {
    const check = await this.checkRepository.findOne(id);
    if (check.changedCheck) {
      const prevCheck = await this.checkRepository.findOne({
        where: { parentCheckId: check.id },
      });
      return prevCheck?.id;
    }
    return undefined;
  }

  async delete(
    id: number,
    needUpdateDeliveryLines: Boolean = false,
    isCheckDelay: Boolean = false,
  ) {
    let checksForDelete: number[] = [];
    let idParam = id;
    do {
      if (idParam) {
        checksForDelete.push(idParam);
      }
      idParam = await this.treeDeleteCheck(idParam);
    } while (idParam);

    checksForDelete.reverse().forEach(async (idDel) => {
      const checkLines: CheckLine[] =
        await this.checkLineService.getAllByCheckId(idDel);

      if (!checkLines.length) {
        throw {
          message: `Нет данных о строках чека с id = ${idDel}`,
        };
      }

      if (checksForDelete.length > 0) {
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

        await this.checkRepository.delete(idDel);
      }
    });

    return id;
  }

  async getHistory(id: number) {
    let checksForHistory: Check[] = [];
    let idParam = id;
    do {
      if (idParam) {
        const check = await this.checkRepository.findOne(idParam);
        checksForHistory.push(check);
      }
      idParam = await this.treeDeleteCheck(idParam);
    } while (idParam);

    const serCheckForHistory = [];
    for (const check of checksForHistory.reverse()) {
      const serCheck = await serializerCheckForDB(check);
      serCheckForHistory.push(serCheck);
    }
    return serCheckForHistory;
  }
}

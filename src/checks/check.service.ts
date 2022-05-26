import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CreateCheckDto, CreateTableCheckDto } from './dto/create-check.dto';
import { GetAllChecksDto, WhereCheckDto } from './dto/getAll-check.dto';
import { Check } from '../entities/Check';
import { BonusCard } from '../entities/BonusCard';
import { User } from '../entities/User';
import {
  serializerCheckForDB,
  serializerCheckWithLineForDB,
} from './check.serializer';
import { timeOut } from 'src/const';

import { BonusCardService } from 'src/bonusCard/bonusCard.service';

import { CheckLineService } from 'src/checkLines/checkLines.service';
import { CheckLineCreateDto } from 'src/checkLines/dto/create-checkLine.dto';

import { UserService } from 'src/users/users.service';
import { CheckLine } from 'src/entities/CheckLine';

import { ProductService } from 'src/products/products.service';
import { UpdateCountProductDto } from 'src/products/dto/updateCount-product.dto';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
    private readonly bonusCardService: BonusCardService,
    private readonly checkLineService: CheckLineService,
    private readonly userService: UserService,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async turnProduct(id: number) {
    const checkLines: CheckLine[] = await this.checkLineService.getAllByCheckId(
      id,
    );
    const products: UpdateCountProductDto[] = [];

    for (const line of checkLines) {
      const data = await this.productService.deltaCount(
        +line.productFK.id,
        -1 * line.productCount,
      );
      products.push(data);
    }

    await this.productService.updateArr(products);
  }

  async getAll({
    page,
    pageSize,
    delayedShow = false,
    changedShow = false,
    dateStart,
    dateEnd,
  }: GetAllChecksDto) {
    const overdueChecks = await this.checkRepository.find({
      where: {
        dateTime: Raw((date) => `${date} < :timeOut`, {
          timeOut: new Date(new Date().getTime() - timeOut),
        }),
        paid: false,
      },
    });

    for (const check of overdueChecks) {
      await this.turnProduct(check.id);
      await this.delete(check.id, false);
    }

    const where: WhereCheckDto = {
      dateTime: Raw((date) => `${date} >= :dateStart AND ${date} <= :dateEnd`, {
        dateStart,
        dateEnd,
      }),
      parentCheckId: null,
      isCancelled: false,
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
        // надо прибавить кол-во которое было в пред чеке, чтобы потом спокойно вычесть новое
        prevCheck = await this.checkRepository.findOne(checkData.parentCheckId);
        if (!prevCheck) {
          throw {
            message: `Чека с id = ${checkData.parentCheckId} не существует`,
          };
        }

        await this.turnProduct(prevCheck.id);
      }
    })();

    let bonusCard: BonusCard = checkData.bonusCardFK
      ? await this.bonusCardService.findById(checkData.bonusCardFK)
      : null;

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
    check.isCancelled = false;

    let createdCheck = await this.checkRepository.save(check);

    const checkLines: CheckLineCreateDto[] = [];
    const products: UpdateCountProductDto[] = [];

    for (const line of checkData.checkLines) {
      const updatedLine = {
        ...line,
        checkFK: createdCheck,
      };
      checkLines.push(updatedLine);

      await this.productService
        .deltaCount(+updatedLine.productFK, updatedLine.productCount)
        .then((res) => products.push(res))
        .catch(async (err) => {
          await this.checkRepository.delete(createdCheck.id);
          throw { message: err.message };
        });
    }

    await this.productService.updateArr(products);
    await this.checkLineService.createCheckLinesArr(checkLines);

    if (checkData.changedCheck) {
      await this.checkRepository.update(prevCheck.id, {
        changedCheck: true,
        parentCheckId: createdCheck,
      });
    }

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
    dirty?: Boolean,
  ) {
    let checksForDelete: number[] = [];
    let idParam = id;
    do {
      if (idParam) {
        checksForDelete.push(idParam);
      }
      idParam = await this.treeDeleteCheck(idParam);
    } while (idParam);

    for (const idDel of checksForDelete.reverse()) {
      const checkInfo = await this.checkRepository.findOne(idDel);
      const checkLines: CheckLine[] =
        await this.checkLineService.getAllByCheckId(idDel);

      if (!dirty) {
        if (!checkLines.length) {
          throw {
            message: `Нет данных о строках чека с id = ${idDel}`,
          };
        }

        if (checksForDelete.length > 0) {
          const products: UpdateCountProductDto[] = [];
          const deleteLines: Array<number> = [];

          for (const line of checkLines) {
            if (needUpdateDeliveryLines) {
              const data = await this.productService.deltaCount(
                +line.productFK.id,
                -1 * line.productCount,
              );
              products.push(data);
            }
            deleteLines.push(line.id);
          }

          if (needUpdateDeliveryLines) {
            await this.productService.updateArr(products);
          }

          if (!checkInfo.paid) {
            await this.checkLineService.deleteArr(deleteLines);
          }
        }
      }
      checkInfo.paid
        ? await this.checkRepository.update(idDel, { isCancelled: true })
        : await this.checkRepository.delete(idDel);
    }

    return id;
  }

  async getHistory(id: number) {
    let checksForHistory: Check[] = [];
    let idParam = id;
    do {
      if (idParam) {
        const check = await this.checkRepository.findOne({
          where: { id: idParam },
          relations: ['checkLines'],
        });
        checksForHistory.push(check);
      }
      idParam = await this.treeDeleteCheck(idParam);
    } while (idParam);

    const serCheckForHistory = [];
    for (const check of checksForHistory.reverse()) {
      const serCheck = await serializerCheckWithLineForDB(check);
      serCheckForHistory.push(serCheck);
    }
    return serCheckForHistory;
  }

  async getAllByPeriod(dateStart: Date): Promise<CheckLine[]> {
    const checks = await this.checkRepository.find({
      where: {
        dateTime: Raw((date) => `${date} >= :timeOut`, {
          timeOut: dateStart,
        }),
      },
      relations: ['checkLines'],
    });
    const checkLines = [];
    for (const line of checks) {
      checkLines.push(...line.checkLines);
    }
    return checkLines;
  }

  async getAllBetweenPeriod(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<CheckLine[]> {
    const checks = await this.checkRepository.find({
      where: {
        parentCheckId: null,
        paid: true,
        dateTime: Raw(
          (date) => `${date} >= :dateStart AND ${date} <= :dateEnd`,
          {
            dateStart,
            dateEnd,
          },
        ),
      },
      relations: ['checkLines'],
    });
    const checkLines = [];
    for (const line of checks) {
      checkLines.push(...line.checkLines);
    }
    return checkLines;
  }
}

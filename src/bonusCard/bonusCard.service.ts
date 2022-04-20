import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { BonusCard } from '../entities/BonusCard';

import { BonusCardOwnerService } from 'src/bonusCardOwner/bonusCardOwner.service';

@Injectable()
export class BonusCardService {
  constructor(
    @InjectRepository(BonusCard)
    private bonusCardRepository: Repository<BonusCard>,
    private readonly bonusCardOwnerService: BonusCardOwnerService,
  ) {}

  async findById(id: number): Promise<BonusCard> {
    const data = await this.bonusCardRepository.findOne(id);
    return data;
  }

  async update(id: number, newBonus: number, usedBonus: number) {
    const card: BonusCard = await this.findById(id);
    const newSum =
      card.bonusCount + newBonus - usedBonus > 0
        ? card.bonusCount + newBonus - usedBonus
        : 0;
    await this.bonusCardRepository.update(id, {
      bonusCount: newSum,
    });
  }

  async findAll() {
    const data = await this.bonusCardRepository.find();
    const serBonusCards = [];
    for (const bonusCard of data) {
      serBonusCards.push({
        id: bonusCard.id,
        FIO: bonusCard.bonusCardOwnerFK.fio,
        bonus: bonusCard.bonusCount,
      });
    }
    return serBonusCards;
  }

  async findAllSearch(value: string) {
    if (!value) {
      return [];
    } else {
      const bonusCardOwnerns = await this.bonusCardOwnerService.findAllSearch(
        value,
      );
      const data: BonusCard[] = [];
      if (Number.isNaN(Number(value))) {
        for (const card of bonusCardOwnerns) {
          const dataEl = await this.bonusCardRepository.findOne({
            where: { bonusCardOwnerFK: card.id },
          });
          data.push(dataEl);
        }
      } else {
        const dataEls = await this.bonusCardRepository
          .createQueryBuilder('BonusCard')
          .where('CONVERT(VARCHAR(20), BonusCard.id) LIKE :val', {
            val: `%${value}%`,
          })
          .leftJoinAndSelect('BonusCard.bonusCardOwnerFK', 'BonusCardOwner')
          .getMany();
        data.push(...dataEls);
      }

      const serBonusCards = [];
      for (const bonusCard of data) {
        serBonusCards.push({
          id: bonusCard.id,
          FIO: bonusCard.bonusCardOwnerFK.fio,
          bonus: bonusCard.bonusCount,
        });
      }
      return serBonusCards;
    }
  }
}

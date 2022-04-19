import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { BonusCard } from '../entities/BonusCard';

@Injectable()
export class BonusCardService {
  constructor(
    @InjectRepository(BonusCard)
    private bonusCardRepository: Repository<BonusCard>,
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
      // если надо fio, то еще по той фигня отдельно делать надо
      const data = await this.bonusCardRepository.find({
        where: { id: Like(value) },
      });

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

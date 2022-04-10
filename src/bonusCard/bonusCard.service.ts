import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    let card: BonusCard;
    await this.findById(id).then((res) => (card = res));
    const newSum =
      card.bonusCount + newBonus - usedBonus > 0
        ? card.bonusCount + newBonus - usedBonus
        : 0;
    await this.bonusCardRepository.update(id, {
      bonusCount: newSum,
    });
  }
}

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
    await this.bonusCardRepository.update(id, {
      bonusCount: card.bonusCount + newBonus - usedBonus,
    });
  }
}

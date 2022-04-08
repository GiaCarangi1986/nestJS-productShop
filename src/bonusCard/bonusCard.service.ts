import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBonusCardDto } from './dto/update-bonusCard.dto';
import { BonusCard } from 'src/entities/BonusCard';

@Injectable()
export class BonusCardService {
  constructor(
    @InjectRepository(BonusCard)
    private bonusCardRepository: Repository<BonusCard>,
  ) {}

  async updateBonusCard(bonusCard: UpdateBonusCardDto) {
    await this.bonusCardRepository.update(bonusCard.id, {
      bonusCount: bonusCard.bonusCount,
    });
  }
}

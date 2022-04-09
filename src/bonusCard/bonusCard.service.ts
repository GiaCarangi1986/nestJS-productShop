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

  async findById(id: number) {
    return await this.bonusCardRepository.findOneOrFail(id);
  }

  async update(bonusCard: UpdateBonusCardDto) {
    return await this.bonusCardRepository.update(bonusCard.id, {
      bonusCount: bonusCard.bonusCount,
    });
  }
}

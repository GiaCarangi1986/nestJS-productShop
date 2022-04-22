import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusCardOwner } from 'src/entities/BonusCardOwner';

@Injectable()
export class BonusCardOwnerService {
  constructor(
    @InjectRepository(BonusCardOwner)
    private bonusCardOwnerRepository: Repository<BonusCardOwner>,
  ) {}

  async findAllSearch(value: string) {
    const data = await this.bonusCardOwnerRepository
      .createQueryBuilder('BonusCardOwner')
      .where('LOWER(BonusCardOwner.fio) LIKE :fio', {
        fio: `%${value.toLowerCase()}%`,
      })
      .getMany();

    return data;
  }
}

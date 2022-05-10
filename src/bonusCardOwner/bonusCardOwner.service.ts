import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusCardOwner } from 'src/entities/BonusCardOwner';

import { CreateBonusCardOwnerDBDto } from 'src/bonusCard/dto/create-bonusCard.dto';

@Injectable()
export class BonusCardOwnerService {
  constructor(
    @InjectRepository(BonusCardOwner)
    private bonusCardOwnerRepository: Repository<BonusCardOwner>,
  ) {}

  async create(data: CreateBonusCardOwnerDBDto) {
    const bonusCard = await this.bonusCardOwnerRepository.save(data);
    return bonusCard;
  }

  async findById(id: number) {
    const bonusCard = await this.bonusCardOwnerRepository.findOne(id);
    return bonusCard;
  }

  async update(id: number, data: CreateBonusCardOwnerDBDto) {
    const bonusCard = await this.bonusCardOwnerRepository.update(id, data);
    return bonusCard;
  }

  async findByLogin(phone: string, email: string | null) {
    return this.bonusCardOwnerRepository.findOne({ phone, email });
  }

  async findAllSearch(value: string) {
    const data = await this.bonusCardOwnerRepository
      .createQueryBuilder('BonusCardOwner')
      .where('LOWER(BonusCardOwner.fio) LIKE :fio', {
        fio: `%${value.toLowerCase()}%`,
      })
      .getMany();

    return data;
  }

  async findAll() {
    return this.bonusCardOwnerRepository.find();
  }
}

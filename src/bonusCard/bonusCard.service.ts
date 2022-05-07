import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusCard } from '../entities/BonusCard';
import {
  CreateBonusCardOwnerDto,
  CreateBonusCardDBDto,
} from './dto/create-bonusCard.dto';

import { BonusCardOwnerService } from 'src/bonusCardOwner/bonusCardOwner.service';

import { GenderService } from 'src/gender/gender.service';

@Injectable()
export class BonusCardService {
  constructor(
    @InjectRepository(BonusCard)
    private bonusCardRepository: Repository<BonusCard>,
    private readonly bonusCardOwnerService: BonusCardOwnerService,
    private readonly genderServiceService: GenderService,
  ) {}

  async findById(id: number): Promise<BonusCard> {
    const data = await this.bonusCardRepository.findOne({
      where: { id, active: true },
    });
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
    const data = await this.bonusCardRepository.find({
      where: { active: true },
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

  async findAllOwners() {
    const data = await this.bonusCardRepository
      .createQueryBuilder('BonusCard')
      .where('active = :active', { active: true })
      .leftJoinAndSelect('BonusCard.bonusCardOwnerFK', 'BonusCardOwner')
      .leftJoinAndSelect('BonusCardOwner.genderFK', 'Gender')
      .orderBy('BonusCardOwner.fio', 'ASC')
      .getMany();

    const serBonusCards = [];
    for (const bonusCard of data) {
      serBonusCards.push({
        id: bonusCard.id,
        FIO: bonusCard.bonusCardOwnerFK.fio,
        phone: bonusCard.bonusCardOwnerFK.phone,
        email: bonusCard.bonusCardOwnerFK.email,
        birthDate: bonusCard.bonusCardOwnerFK.birthDate,
        gender: bonusCard.bonusCardOwnerFK.genderFK.title,
      });
    }
    return serBonusCards;
  }

  async delete(id: number) {
    const data = await this.bonusCardRepository.findOne(id);
    if (!data) {
      throw {
        message: `Нет данных о владельце карты с id = ${id}`,
      };
    }
    await this.bonusCardRepository.update(id, { active: false });
    return this.findAllOwners();
  }

  async create(data: CreateBonusCardOwnerDto) {
    const gender = await this.genderServiceService.findById(data.genderFK);
    const bonusCardOwner = await this.bonusCardOwnerService.create({
      fio: data.FIO,
      phone: data.phone,
      email: data.email,
      birthDate: data.birthDate,
      genderFK: gender,
    });

    const bonusCard: CreateBonusCardDBDto = {
      bonusCount: 50,
      active: true,
      bonusCardOwnerFK: bonusCardOwner,
    };
    await this.bonusCardRepository.save(bonusCard);
    return this.findAllOwners();
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
            where: { bonusCardOwnerFK: card.id, active: true },
          });
          data.push(dataEl);
        }
      } else {
        const dataEls = await this.bonusCardRepository
          .createQueryBuilder('BonusCard')
          .where('CONVERT(VARCHAR(20), BonusCard.id) LIKE :val', {
            val: `%${value}%`,
          })
          .andWhere('active = :active', { active: true })
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

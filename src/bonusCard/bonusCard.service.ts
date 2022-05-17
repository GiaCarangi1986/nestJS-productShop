import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
    private readonly genderService: GenderService,
  ) {}

  async findById(id: number): Promise<BonusCard> {
    const data = await this.bonusCardRepository.findOne({
      where: { id, active: true },
    });
    return data;
  }

  async getBonusCardData(id: number) {
    const data = await this.findById(id);
    if (!data) {
      throw {
        message: `Нет данных о карте с id = ${id}`,
      };
    }
    const gender = await this.genderService.getForSelectById(
      data.bonusCardOwnerFK.genderFK.id,
    );
    const fio = data.bonusCardOwnerFK.fio.split(' ');

    return {
      birthDate: data.bonusCardOwnerFK.birthDate,
      email: data.bonusCardOwnerFK.email,
      firstName: fio[1],
      gender,
      patronymic: fio[2],
      phone: data.bonusCardOwnerFK.phone,
      secondName: fio[0],
      id: data.id,
    };
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
      .leftJoinAndSelect('BonusCard.bonusCardOwnerFK', 'BonusCardOwner')
      .leftJoinAndSelect('BonusCardOwner.genderFK', 'Gender')
      .where('BonusCard.active = :active', { active: true })
      .andWhere(
        `(LOWER(BonusCardOwner.fio) LIKE :fio
         OR CONVERT(VARCHAR(20), BonusCard.id) LIKE :id
          OR LOWER(BonusCardOwner.email) LIKE :email
          OR CONVERT(VARCHAR, BonusCardOwner.birthDate, 104) LIKE :birthDate
          OR LOWER(Gender.title) LIKE :genderTitle)`,
        {
          id: `%11.11%`,
          fio: `%${'11.11'.toLowerCase()}%`,
          email: `%${'11.11'.toLowerCase()}%`,
          birthDate: `%11.11%`,
          genderTitle: `%${'11.11'.toLowerCase()}%`,
        },
      )
      // OR BonusCardOwner.birthDate LIKE :birthDate
      // .andWhere(new Brackets((qb) => {
      //   qb.
      // }))
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

  async checkData(phone: string, email: string | null, id: number | null) {
    const data = await this.bonusCardOwnerService.findByLogin(phone, email, id);
    if (data) {
      const bonusCardActive = await this.bonusCardRepository.findOne({
        where: { bonusCardOwnerFK: data, active: true },
      });
      if (bonusCardActive) {
        throw {
          message: 'Пользователь с такими телефоном и/или email уже существует',
        };
      }
    }
  }

  async create(data: CreateBonusCardOwnerDto) {
    await this.checkData(data.phone, data.email, null);

    const gender = await this.genderService.findById(data.genderFK);
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

  async updateAllData(id: number, data: CreateBonusCardOwnerDto) {
    // id - id карты, а не чела!
    const user = await this.bonusCardRepository.findOne(id);
    await this.checkData(data.phone, data.email, user.bonusCardOwnerFK.id);

    const gender = await this.genderService.findById(data.genderFK);
    await this.bonusCardOwnerService.update(user.bonusCardOwnerFK.id, {
      fio: data.FIO,
      phone: data.phone,
      email: data.email,
      birthDate: data.birthDate,
      genderFK: gender,
    });

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
          if (dataEl) {
            data.push(dataEl);
          }
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
        if (dataEls) {
          data.push(...dataEls);
        }
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

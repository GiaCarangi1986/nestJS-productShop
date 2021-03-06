import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from 'src/entities/Gender';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
  ) {}

  async getForSelect() {
    const genderList = await this.genderRepository.find();
    const genderSer = [];
    for (const gender of genderList) {
      genderSer.push({
        id: gender.id,
        title: gender.title,
      });
    }
    return genderSer;
  }

  async getForSelectById(id: number) {
    const gender = await this.genderRepository.findOne(id);
    return {
      id: gender.id,
      title: gender.title,
    };
  }

  async findById(id: number): Promise<Gender> {
    const gender = await this.genderRepository.findOne(id);
    if (!gender) {
      throw {
        message: `Нет данных о поле с id = ${id}`,
      };
    }
    return gender;
  }
}

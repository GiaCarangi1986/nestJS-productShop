import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { LoginUserDto } from './dto/login-user.dto';
import { GetBestSellersDtoQS } from './dto/getBestSellers-users.dto';

import { CheckService } from 'src/checks/check.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => CheckService))
    private checkService: CheckService,
  ) {}

  async findById(id: number): Promise<User> {
    const data = await this.userRepository.findOne(id);
    return data;
  }

  async login({ login, password }: LoginUserDto) {
    const data = await this.userRepository.findOne({
      where: { phone: login, password },
    });
    if (!data) {
      throw {
        message: 'Логин и/или пароль неверны',
      };
    }
    const fio = data.fio.split(' ');
    return {
      firstName: fio[1],
      lastName: fio[0],
      id: data.id,
      role: data.roleFK.title,
    };
  }

  async getBestSellers({ dateStart, dateEnd }: GetBestSellersDtoQS) {
    const checkLines = await this.checkService.getAllBetweenPeriod(
      dateStart,
      dateEnd,
    );

    const users = await this.userRepository.find();
    const serUsers = [];
    for (const user of users) {
      serUsers.push({
        fio: user.fio,
        sales: 0,
        role: user.roleFK.title,
        id: user.id,
      });
    }

    for (const checkLine of checkLines) {
      for (const serUser of serUsers) {
        if (checkLine.checkFK.userFK.id === serUser.id) {
          serUser.sales += checkLine.price * checkLine.productCount;
        }
      }
    }

    const sortUsers = serUsers.sort(function (a, b) {
      if (a.sales > b.sales) {
        return -1;
      }
      if (a.sales < b.sales) {
        return 1;
      }
      return a.fio > b.fio ? 1 : a.fio < b.fio ? -1 : 0;
    });

    return sortUsers;
  }
}

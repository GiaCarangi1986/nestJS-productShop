import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { LoginUserDto } from './dto/login-user.dto';
import { GetBestSellersDtoQS } from './dto/getBestSellers-users.dto';
import { USER_ROLE } from 'src/const';
import { RoleDto, RoleDBDto } from './dto/create-user.dto';

import { CheckService } from 'src/checks/check.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => CheckService))
    private checkService: CheckService,

    private readonly roleService: RoleService,
  ) {}

  async findById(id: number): Promise<User> {
    const data = await this.userRepository.findOne(id);
    return data;
  }

  async getUserData(id: number) {
    const user = await this.userRepository.findOne(id);
    const fio = user.fio.split(' ');

    return {
      id: user.id,
      secondName: fio[0],
      firstName: fio[1],
      patronymic: fio[2],
      password: user.password,
      phone: user.phone,
      email: user.email,
      role: {
        id: user.roleFK.id,
        title: user.roleFK.title,
      },
    };
  }

  async delete(id: number) {
    const data = await this.userRepository.findOne(id);
    if (!data) {
      throw {
        message: `Нет данных о пользователе с id = ${id}`,
      };
    }
    if (data.roleFK.title !== USER_ROLE.admin) {
      await this.userRepository.update(id, { isDelete: true });
      return this.findAllUsers();
    } else {
      throw {
        message: 'Нельзя удалить администратора',
      };
    }
  }

  async create(user: RoleDto) {
    const roleFK = await this.roleService.getById(user.roleFK);
    const adminUser = await this.userRepository.findOne({ where: { roleFK } });
    if (adminUser.roleFK.title === USER_ROLE.admin) {
      throw {
        message: 'Админ уже создан',
      };
    }
    const userExist = await this.userRepository.findOne({
      where: { phone: user.phone, password: user.password },
    });
    if (userExist) {
      // позже это в отдельную ф-цию вынести проверки
      throw {
        message: 'Пользователь с такими телефоном и паролем уже существуют',
      };
    }
    const userData: RoleDBDto = {
      fio: user.FIO,
      phone: user.phone,
      email: user.email,
      password: user.password,
      roleFK,
      isDelete: false,
    };
    await this.userRepository.save(userData);

    return this.findAllUsers();
  }

  async findAllUsers() {
    const data = await this.userRepository.find({
      where: { isDelete: false },
      order: { fio: 'ASC' },
    });
    const serUsers = [];
    for (const user of data) {
      serUsers.push({
        id: user.id,
        FIO: user.fio,
        phone: user.phone,
        email: user.email,
        password: user.password,
        role: user.roleFK.title,
      });
    }
    return serUsers;
  }

  async login({ login, password }: LoginUserDto) {
    const data = await this.userRepository.findOne({
      where: { phone: login, password, isDelete: false },
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

    const users = await this.userRepository.find({
      where: { isDelete: false },
    });
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

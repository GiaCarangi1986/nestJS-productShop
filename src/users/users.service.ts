import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      roleId: data.roleFK.id,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WriteOffAct } from 'src/entities/WriteOffAct';

@Injectable()
export class WriteOffService {
  constructor(
    @InjectRepository(WriteOffAct)
    private userRepository: Repository<WriteOffAct>,
  ) {}

  async findLast(): Promise<Date> {
    const data = await this.userRepository.find();
    return data[data.length - 1]?.dateTimeWriteOff || null;
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CheckLineCreateDto } from './dto/create-checkLine.dto';
// import { DeliveryLine } from 'src/entities/DeliveryLine';

// @Injectable()
// export class DeliveryLineService {
//   constructor(
//     @InjectRepository(DeliveryLine)
//     private checkLineRepository: Repository<DeliveryLine>,
//   ) {}

//   async getAllByCheckId(checkFK: number): Promise<DeliveryLine[]> {
//     const checkLines = await this.checkLineRepository.find();
//     return checkLines.filter((line) => line.checkFK.id === checkFK);
//   }

//   async createCheckLinesArr(checkLineArray: CheckLineCreateDto[]) {
//     checkLineArray.forEach(async (line) => {
//       this.checkLineRepository.create(line);
//       await this.checkLineRepository.save(line);
//     });
//   }

//   async deleteOne(id: number) {
//     await this.checkLineRepository.delete(id);
//   }

//   async updateOne(checkLine: CheckLine) {
//     await this.checkLineRepository.update(checkLine.id, {
//       productCount: checkLine.productCount,
//       oldProduct: checkLine.oldProduct,
//     });
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateEditedCheckDto } from './dto/updateEdited-check.dto';
import { CheckService } from './check.service';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  getAll() {
    return this.checkService.getAll();
  }

  @Post()
  create(@Body() checkData: CreateCheckDto) {
    return this.checkService.create(checkData);
  }

  @Patch(':id')
  updateEdited(@Param('id') id: number, @Body() data: UpdateEditedCheckDto) {
    return this.checkService.updateEdited(+id, {
      parentCheckId: data.parentCheckId,
    });
  }

  @Put(':id')
  async updatePaid(@Param('id') id: number, @Body() data: CreateCheckDto) {
    const error = await this.checkService.create(data);
    if (typeof error === 'string') {
      return error;
    }
    return this.checkService.delete(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.checkService.delete(+id, true);
  }
}

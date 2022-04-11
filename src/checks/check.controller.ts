import { Controller, Get, Post, Body, Put, Param, Patch } from '@nestjs/common';
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
  updatePaid(@Param('id') id: number, @Body() data: CreateCheckDto) {
    return this.checkService.updatePaid(+id, { ...data });
  }
}

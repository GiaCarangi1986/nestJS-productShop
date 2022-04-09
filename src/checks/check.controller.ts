import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
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

  @Put(':id')
  updateEdited(
    @Param('id') id: number,
    @Body() parentId: UpdateEditedCheckDto,
  ) {
    return `This action updates a #${id} cat, ${parentId.parentCheckId}`;
  }
}

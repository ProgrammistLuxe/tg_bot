import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubjectModel } from './models/create-subject.model';
import { Subject } from './entities/subject.entity';

@ApiTags('tg-bot')
@ApiBearerAuth()
@Controller('subject')
export class SubjectController {
  constructor(private readonly answerService: SubjectService) {}
  @Post()
  create(@Body() answer: CreateSubjectModel) {
    return this.answerService.createSubject(answer);
  }

  @ApiOkResponse({
    description: 'The subject records',
    type: Subject,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @ApiOkResponse({
    description: 'The subject records',
    type: Subject,
    isArray: false,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }
  @Get('byName')
  findOneByName(@Body() name: string) {
    return this.answerService.findOneByName(name);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() subject: CreateSubjectModel) {
    return this.answerService.updateSubject(+id, subject);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.deleteSubject(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { User } from '../user/user.entity';
import { GetUser } from '../user/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Dictionary } from './dictionary.entity';

@Controller('dictionary')
@UseGuards(AuthGuard('jwt'))
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post()
  create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @GetUser() user: User,
  ): Promise<Dictionary> {
    return this.dictionaryService.create(createDictionaryDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Dictionary[]> {
    return this.dictionaryService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Dictionary> {
    return this.dictionaryService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @GetUser() user: User,
  ): Promise<Dictionary> {
    return this.dictionaryService.update(id, updateDictionaryDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictionaryService.remove(id);
  }
}

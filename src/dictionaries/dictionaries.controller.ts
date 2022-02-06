import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { User } from '../user/user.entity';
import { GetUser } from '../user/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Dictionary } from './dictionary.entity';

@Controller('dictionary')
@UseGuards(AuthGuard('jwt'))
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Post()
  create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @GetUser() user: User,
  ): Promise<Dictionary> {
    return this.dictionariesService.create(createDictionaryDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Dictionary[]> {
    return this.dictionariesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User): Promise<Dictionary> {
    return this.dictionariesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @GetUser() user: User,
  ): Promise<Dictionary> {
    return this.dictionariesService.update(id, updateDictionaryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User): Promise<Dictionary> {
    return this.dictionariesService.remove(id, user);
  }
}

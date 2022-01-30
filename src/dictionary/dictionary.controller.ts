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
  findAll(@GetUser() user: User) {
    return this.dictionaryService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictionaryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ) {
    return this.dictionaryService.update(+id, updateDictionaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictionaryService.remove(+id);
  }
}

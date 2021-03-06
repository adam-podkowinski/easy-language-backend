import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Word } from './word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { JwtAccessGuard } from '../authentication/jwt-guards';

@Controller('words')
@UseGuards(JwtAccessGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(
    @Body() createWordDto: CreateWordDto,
    @GetUser() user: User,
  ): Promise<Word> {
    return this.wordsService.create(createWordDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Word[]> {
    return this.wordsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User): Promise<Word> {
    return this.wordsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWordDto: UpdateWordDto,
    @GetUser() user: User,
  ): Promise<Word> {
    return this.wordsService.update(id, updateWordDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User): Promise<Word> {
    return this.wordsService.remove(id, user);
  }
}

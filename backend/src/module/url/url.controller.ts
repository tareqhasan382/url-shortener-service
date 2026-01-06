import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import * as requestWithUserInterface from '../user/dto/request-with-user.interface';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new short URL' })
  async create(
    @Req() req: requestWithUserInterface.GetMe,
    @Body() createUrlDto: CreateUrlDto,
  ) {
    const userId = req.user.id;
    return this.urlService.create(userId, createUrlDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all URLs for the authenticated user' })
  findAll(@Req() req: requestWithUserInterface.GetMe,) {
    const userId = req.user.id;
    return this.urlService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlService.update(+id, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(+id);
  }
}

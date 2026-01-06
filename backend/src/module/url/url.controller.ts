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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import * as requestWithUserInterface from '../user/dto/request-with-user.interface';
import express from 'express';
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
  findAll(@Req() req: requestWithUserInterface.GetMe) {
    const userId = req.user.id;
    return this.urlService.findAll(userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user statistics' })
  async getStats(@Req() req: requestWithUserInterface.GetMe) {
    return this.urlService.getUserStats(req.user.id);
  }
  @Get('redirect/:shortCode')
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiParam({ name: 'shortCode', description: 'Short code (4-6 characters)' })
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: express.Response,
  ) {
    const originalUrl = await this.urlService.redirect(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific URL by ID' })
  @ApiParam({ name: 'id', description: 'URL ID' })
  async findOne(
    @Param('id') id: string,
    @Req() req: requestWithUserInterface.GetMe,
  ) {
    return this.urlService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update URL metadata (title, description)' })
  @ApiParam({ name: 'id', description: 'URL ID' })
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: requestWithUserInterface.GetMe,
  ) {
    return this.urlService.update(id, req.user.id, updateUrlDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiParam({ name: 'id', description: 'URL ID' })
  async remove(
    @Param('id') id: string,
    @Req() req: requestWithUserInterface.GetMe,
  ) {
    return this.urlService.remove(id, req.user.id);
  }
}

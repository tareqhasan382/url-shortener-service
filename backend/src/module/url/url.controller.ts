import {
  Controller,
  Get,
  Query,
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
import {GetMyUrlsDto} from "./dto/get-my-urls.dto";

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create short URL' })
  create(
    @Req() req: requestWithUserInterface.GetMe,
    @Body() dto: CreateUrlDto,
  ) {
    return this.urlService.create(req.user.id, dto);
  }

  @Get("my-urls")
  @UseGuards(JwtAuthGuard)
  findAll(
      @Req() req: requestWithUserInterface.GetMe,
      @Query() query: GetMyUrlsDto,
  ) {
    const { page, limit, search } = query;
    return this.urlService.findAll(req.user.id, page, limit, search);
  }
  @Get('analytics/overview')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'URL analytics overview' })
  analyticsOverview(
    @Req() req: requestWithUserInterface.GetMe,
  ) {
    return this.urlService.analyticsOverview(req.user.id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req: requestWithUserInterface.GetMe,
    @Body() dto: UpdateUrlDto,
  ) {
    return this.urlService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: requestWithUserInterface.GetMe) {
    return this.urlService.remove(id, req.user.id);
  }
}

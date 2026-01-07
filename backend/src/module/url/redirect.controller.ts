import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import express from 'express';
import { UrlService } from './url.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: express.Response,
  ) {
    const originalUrl = await this.urlService.redirect(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}

import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { UrlService } from './url.service';

const RESERVED = ['url', 'user', 'auth', 'health', 'favicon.ico'];

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    if (RESERVED.includes(shortCode.toLowerCase())) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Not found' });
    }

    const originalUrl = await this.urlService.redirect(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}

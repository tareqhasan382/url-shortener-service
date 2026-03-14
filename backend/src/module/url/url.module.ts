import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlClickFlushService } from './url-click-flush.service';
import { RedirectController } from './redirect.controller';

@Module({
  controllers: [UrlController,RedirectController],
  providers: [UrlService,UrlClickFlushService],
  exports: [UrlService],
})
export class UrlModule {}

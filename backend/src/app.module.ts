import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './module/user/user.module';
import { UrlModule } from './module/url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    JwtModule.register({
      global: true, // 👈 VERY IMPORTANT
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
      },
    }),

    PrismaModule,
    AuthModule,
    UserModule,
    UrlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

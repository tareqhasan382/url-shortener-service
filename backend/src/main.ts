import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.setup';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173'];

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });
    // --- VALIDATION ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
    // --- SWAGGER ---
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

    // --- START SERVER ---
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Server running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
}
bootstrap();

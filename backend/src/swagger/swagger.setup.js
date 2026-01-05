import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';
export function setupSwagger(app) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
}

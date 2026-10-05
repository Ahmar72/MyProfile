import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    // Global validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // CORS
    app.enableCors();

    // Swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle('User API')
        .setDescription('API for creating and managing users')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    const port = config.get<number>('port') ?? 3002;
    await app.listen(port);
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📘 Swagger docs at http://localhost:${port}/api-docs`);
}

bootstrap();
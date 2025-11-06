import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({}));
  // Config swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cogniate Backend')
    .setDescription('API documentation for Cogniate Backend')
    .setVersion('1.0.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-session-id', in: 'header' },
      'x-session-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  document.security = [{ 'x-session-id': [] }];
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // App listen
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

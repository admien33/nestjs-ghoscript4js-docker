import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { cors: true });


  app.use(express.static('src/templates')); 

  await app.listen(3000);
}
bootstrap();

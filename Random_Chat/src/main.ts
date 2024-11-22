import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Adjust methods as needed
    allowedHeaders: ['Authorization', 'Content-Type'], // Add any other headers you might need
    credentials: true, // Allow cookies
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());

  await app.listen(3006);
}
bootstrap();

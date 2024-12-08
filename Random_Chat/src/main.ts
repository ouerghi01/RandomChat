import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);

  // Access the ConfigService
  const configService = app.get(ConfigService);
  const environment = configService.get<string>('NODE_ENV') || 'development';
  const port = configService.get<number>('PORT') || 3006;

  // HTTPS Options
  let httpsOptions = null;
  if (environment === 'production') {
    try {
      httpsOptions = {
        key: fs.readFileSync('./src/secrets/key.pem'),
        cert: fs.readFileSync('./src/secrets/cert.pem'),
      };
      console.log('HTTPS enabled for production.');
    } catch (error) {
      console.error('Error loading HTTPS certificates. Falling back to HTTP.');
    }
  }

  // Recreate the app with HTTPS if in production and certificates are valid
  if (httpsOptions) {
    app.close(); // Close the initial app instance
    app = await NestFactory.create(AppModule, { httpsOptions });
  }

  // CORS Configuration
  const corsOptions =
    environment === 'development'
      ? {
          origin: ['http://localhost:3000', 'http://192.168.1.6:3000','http://next_js:3000'], // Frontend URLs
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Authorization', 'Content-Type'],
          credentials: true,
        }
      : {
         origin: ['http://localhost:3000', 'http://192.168.1.6:3000','http://next_js:3000'], // Frontend URLs

          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Authorization', 'Content-Type'],
          credentials: true,
        };
  app.enableCors(corsOptions);

  // Use WebSocket adapter for handling WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));

  // Use cookie-parser to handle cookies
  app.use(cookieParser());

  // Listen on the specified port
  await app.listen(port);
}

bootstrap();


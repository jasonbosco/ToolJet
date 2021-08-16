import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const fs = require('fs');

globalThis.TOOLJET_VERSION = fs.readFileSync('./.version', 'utf8');
globalThis.CACHED_CONNECTIONS = {};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('ToolJet')
    .setDescription('The tooljet API endpoints')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.setGlobalPrefix('api');
  await app.enableCors();

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    }),
  );
  const port = parseInt(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0', function() {
    console.log('Listening on port %d', port);
  });
}

bootstrap();

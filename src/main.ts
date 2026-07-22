import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable Graceful Shutdown Hooks
  app.enableShutdownHooks();

  // Global Prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation Setup
  const docsPath = 'api/docs';
  const config = new DocumentBuilder()
    .setTitle('Mini E-Commerce API')
    .setDescription(
      'Dokumentasi REST API lengkap untuk layanan Mini E-Commerce. Gunakan JWT Token di Authorization Header untuk mengakses endpoint yang dilindungi.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan JWT Token (tanpa prefix Bearer)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoint Otentikasi & Registrasi User')
    .addTag('Users', 'Endpoint Manajemen User & Profil')
    .addTag('Products', 'Endpoint Katalog Produk')
    .addTag('Categories', 'Endpoint Kategori Produk')
    .addTag('Orders', 'Endpoint Transaksi & Pesanan')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsPath, app, document, {
    customSiteTitle: 'Mini E-Commerce API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const serverUrl = await app.getUrl();
  const docsUrl = `${serverUrl}/${docsPath}`;

  console.log(`Server berjalan di : ${serverUrl}`);
  console.log(`API Base URL      : ${serverUrl}/${globalPrefix}`);
  console.log(`Swagger API Docs  : ${docsUrl}`);
}

bootstrap();


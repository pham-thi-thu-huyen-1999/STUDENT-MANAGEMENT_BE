import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import UnauthorizedExceptionFilter from './shared/exceptions/unauthorized-exception.filter';
import ValidationPipe from './shared/pipes/validation.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('UI Template BE')
    .setDescription(`This site and README.md has all the necessary documentation`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, { ignoreGlobalPrefix: false });
  SwaggerModule.setup('/docs', app, document);

  await app.listen(8000);
}
bootstrap();

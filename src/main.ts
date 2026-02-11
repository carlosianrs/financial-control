import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/settings.config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  const logger = new Logger(bootstrap.name);

  await app.listen(serverConfig.port);

  logger.log(`Serviço inicializado na porta ${serverConfig.port}`)
}
bootstrap();

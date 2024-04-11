import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { checkEnvironment } from './static/functions/env-checker.function';
import * as process from 'node:process';
import { ConsoleColorsEnum } from './static/enums/console-colors.enum';
import { IEnvReturnedMessage } from './static/interfaces/env-config.interfaces';
import { EnvNamesEnum } from './static/enums/env-names.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // dotenv
  config();

  let hasEnvError: boolean = false;
  const envMessages: Map<string, IEnvReturnedMessage> = checkEnvironment(
    process.env,
  );
  console.log(ConsoleColorsEnum.bright, `[Environment Checker Results]`);
  envMessages.forEach((value, key) => {
    if (!hasEnvError && value.type === 'error') {
      hasEnvError = true;
    }
    let color: string = '\x1b[0m';
    switch (value.type) {
      case 'success':
        color = ConsoleColorsEnum.green;
        break;
      case 'warning':
        color = ConsoleColorsEnum.yellow;
        break;
      case 'error':
        color = ConsoleColorsEnum.red;
        break;
      case 'info':
        color = ConsoleColorsEnum.grey;
        break;
    }
    console.log(color, key + value.message);
  });
  console.log();
  if (hasEnvError) {
    process.exit(1);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.useBodyParser('json', { limit: '2mb' });
  app.enableCors({ credentials: true, origin: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Раздел "Товары и услуги"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env[EnvNamesEnum.port]);
}

bootstrap();

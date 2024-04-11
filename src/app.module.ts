import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { EnvNamesEnum } from './static/enums/env-names.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get(EnvNamesEnum.db_host),
          port: Number(config.get(EnvNamesEnum.db_port)),
          username: config.get(EnvNamesEnum.db_user),
          password: config.get(EnvNamesEnum.db_password),
          database: config.get(EnvNamesEnum.db_name),
          entities: [],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get(EnvNamesEnum.secret_word),
          // ignoreExpiration: true,
          signOptions: {
            expiresIn: configService.get(EnvNamesEnum.expires_in),
          },
        };
      },
    }),
    // CacheWrapperModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
    AppService,
  ],
})
export class AppModule {}

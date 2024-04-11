import { Module } from '@nestjs/common';
import { CacheWrapperService } from './cache-wrapper.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { EnvNamesEnum } from '../static/enums/env-names.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: 120,
          store: redisStore,
          host: configService.get(EnvNamesEnum.redis_host),
          port: Number(configService.get(EnvNamesEnum.redis_port)) || 6379,
          user: 'default',
          password: configService.get(EnvNamesEnum.redis_password),
        };
      },
    }),
  ],
  providers: [CacheWrapperService],
})
export class CacheWrapperModule {}

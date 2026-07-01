import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsModule } from './urls/urls.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // 1. Load .env globally so every module can inject ConfigService
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Async DB setup — waits for ConfigService to be ready
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASS'),
        database: cfg.get('DB_NAME'),
        autoLoadEntities: true, // picks up entities registered in feature modules
        synchronize: false, // if true AUTO-CREATES tables in dev — disable in prod!
      }),
    }),

    UrlsModule,

    UsersModule,

    AuthModule,

    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Click } from './click.entity';
import { UrlsModule } from 'src/urls/urls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Click]), forwardRef(() => UrlsModule)],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule { }

import { forwardRef, Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './urls.entity';
import { AnalyticsModule } from 'src/analytics/analytics.module';


@Module({
  imports: [TypeOrmModule.forFeature([Url]), forwardRef(() => AnalyticsModule)],
  providers: [UrlsService],
  controllers: [UrlsController],
  exports: [UrlsService]
})
export class UrlsModule { }

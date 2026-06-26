import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './urls.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  providers: [UrlsService],
  controllers: [UrlsController]
})
export class UrlsModule { }

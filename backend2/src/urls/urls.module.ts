import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './urls.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url])], // registers UrlRepository for @InjectRepository(Url)
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}

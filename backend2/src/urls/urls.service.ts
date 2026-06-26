import { Injectable, ConflictException, NotFoundException, GoneException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from "./urls.entity";
import { ConfigService } from '@nestjs/config';
import { CreateUrlDTO } from './dto/urls.dto';
import { User } from 'src/users/users.entity';
// nanoid v3 uses CommonJS exports — import as shown below
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nanoid } = require('nanoid');

@Injectable()
export class UrlsService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepo: Repository<Url>,
        private readonly cfg: ConfigService,
    ) { }

    async createUrl(body: CreateUrlDTO, owner: User): Promise<Url> {
        const now = new Date();
        const shortUrl = body.customShortUrl ?? nanoid(8);
        const existing = await this.urlRepo.findOneBy({ shortUrl });
        if (existing) throw new ConflictException(`ShortUrl - ${shortUrl} is already taken`);


        const expiresAt = body.expiresInDays
            ? new Date(now.getTime() + body.expiresInDays * 86_400_000)
            : null;

        const url = this.urlRepo.create({
            originalUrl: body.originalUrl,
            shortUrl,
            owner,
            expiresAt,
            clicks: 0,
            createdAt: now,
            updatedAt: now,
        });

        return this.urlRepo.save(url);
    }

    async redirect(shortUrl: string): Promise<string> {
        //check if the url exists
        const url = await this.urlRepo.findOneBy({ shortUrl });
        if (!url) throw new NotFoundException(`Url with ${shortUrl} does not exist`)

        const now = new Date()
        if (url.expiresAt && url.expiresAt < now) throw new GoneException('url has expired')

        //update click count
        this.urlRepo.increment({ shortUrl }, 'clicks', 1)

        return url.originalUrl
    }
    async getStats(shortUrl: string, ownerId: string): Promise<Url> {
        const url = await this.urlRepo.findOneBy({ shortUrl })
        if (!url) throw new NotFoundException('Url Not Found')

        if (url.owner.id !== ownerId) throw new ForbiddenException("You do not own this URL")

        return url
    }
    async deleteUrl(shortUrl: string, ownerId: string): Promise<{ message: string }> {
        const url = await this.urlRepo.findOneBy({ shortUrl })
        if (!url) throw new NotFoundException('Url Not Found')

        if (url.owner.id !== ownerId) throw new ForbiddenException("You do not own this URL")

        await this.urlRepo.remove(url)
        return { message: "Url deleted successfully" }
    }




}

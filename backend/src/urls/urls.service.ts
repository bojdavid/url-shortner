import {
    Injectable, NotFoundException,
    ConflictException, ForbiddenException, GoneException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { Url } from './urls.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from "../users/user.entity"

@Injectable()
export class UrlsService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepo: Repository<Url>,
        private readonly cfg: ConfigService,
    ) { }

    async create(dto: CreateUrlDto, owner: User): Promise<Url> {
        const code = dto.customCode?.trim() ?? nanoid(6);
        // Guard against duplicate codes
        const existing = await this.urlRepo.findOneBy({ code });
        if (existing) throw new ConflictException(`Code '${code}' is already taken`);
        let expiresAt: Date | null = null;
        if (dto.expiresInDays) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + dto.expiresInDays);
        }
        // Normalise URL — ensure it has a scheme so browsers redirect correctly
        const originalUrl = /^https?:\/\//i.test(dto.originalUrl)
            ? dto.originalUrl
            : `https://${dto.originalUrl}`;
        const url = this.urlRepo.create({
            originalUrl,
            code, expiresAt,
            owner, ownerId: owner.id
        });
        return this.urlRepo.save(url);
    }

    async redirect(code: string): Promise<string> {
        const url = await this.urlRepo.findOneBy({ code });
        if (!url) throw new NotFoundException('Short URL not found');
        if (url.expiresAt && url.expiresAt < new Date())
            throw new GoneException('This link has expired');
        // Fire-and-forget click increment (doesn't block the redirect)
        this.urlRepo.increment({ code }, 'clicks', 1);
        return url.originalUrl;
    }


    async getStats(code: string, requesterId: string): Promise<Url> {
        const url = await this.urlRepo.findOneBy({ code });
        if (!url) throw new NotFoundException('Short URL not found');
        if (url.ownerId !== requesterId)
            throw new ForbiddenException('You do not own this link');
        return url;
    }

    async remove(code: string, requesterId: string): Promise<void> {
        const url = await this.urlRepo.findOneBy({ code });
        if (!url) throw new NotFoundException('Short URL not found');
        if (url.ownerId !== requesterId)
            throw new ForbiddenException('You do not own this link');
        await this.urlRepo.remove(url);
    }

}

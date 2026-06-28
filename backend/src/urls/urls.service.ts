import {
    Injectable, NotFoundException,
    ConflictException, ForbiddenException, GoneException,
    Inject,
    forwardRef,
    Req
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { Url } from './urls.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { User } from "../users/user.entity"
import { AnalyticsService } from 'src/analytics/analytics.service';

@Injectable()
export class UrlsService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepo: Repository<Url>,
        private readonly cfg: ConfigService,
        @Inject(forwardRef(() => AnalyticsService))
        private readonly analytics: AnalyticsService,
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

    async redirect(code: string, req: Request): Promise<string> {
        const url = await this.urlRepo.findOneBy({ code });
        if (!url) throw new NotFoundException('Short URL not found');
        if (url.expiresAt && url.expiresAt < new Date())
            throw new GoneException('This link has expired');

        // Fire-and-forget click increment (doesn't block the redirect)
        this.urlRepo.increment({ code }, 'clicks', 1);

        // Detailed analytics — also fire-and-forget
        const ip = (req.headers['x-forwarded-for'] as string)
            ?.split(',')[0]?.trim()
            ?? req.socket.remoteAddress ?? null;
        this.analytics.record({
            urlId: url.id,
            ipHash: ip ? AnalyticsService.hashIp(ip) : null,
            userAgent: req.headers['user-agent']?.slice(0, 512) ?? null,
            referer: req.headers['referer']?.slice(0, 2048) ?? null,
            country: null, // add geo-IP lookup here optionally
        });
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Click } from './click.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

export interface ClickRecord {
    urlId: string;
    ipHash: string | null;
    userAgent: string | null;
    referer: string | null;
    country: string | null;
}

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Click)
        private readonly clickRepo: Repository<Click>,
    ) { }

    // Called on every redirect — fire-and-forget
    async record(data: ClickRecord): Promise<void> {
        await this.clickRepo.save(this.clickRepo.create(data));
    }

    // Clicks grouped by calendar day
    async getClicksByDay(urlId: string, days = 30) {
        const rows = await this.clickRepo
            .createQueryBuilder('c')
            .select("DATE(c.clickedAt AT TIME ZONE 'UTC')", 'date')
            .addSelect('COUNT(*)', 'clicks')
            .where('c.urlId = :urlId', { urlId })
            .andWhere("c.clickedAt >= NOW() - INTERVAL '1 day' * :days", { days })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
        return rows.map(r => ({ date: r.date, clicks: Number(r.clicks) }));
    }

    // Top referrers
    async getTopReferers(urlId: string, limit = 10) {
        const rows = await this.clickRepo
            .createQueryBuilder('c')
            .select('c.referer', 'referer')
            .addSelect('COUNT(*)', 'clicks')
            .where('c.urlId = :urlId', { urlId })
            .groupBy('c.referer')
            .orderBy('clicks', 'DESC')
            .limit(limit)
            .getRawMany();
        return rows.map(r => ({ referer: r.referer, clicks: Number(r.clicks) }));
    }

    // Hash an IP for privacy-safe storage
    static hashIp(ip: string): string {
        return createHash('sha256').update(ip).digest('hex');
    }

}

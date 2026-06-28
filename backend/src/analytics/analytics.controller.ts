import { Controller, forwardRef, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UrlsService } from 'src/urls/urls.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('urls/:code/analytics')
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
        @Inject(forwardRef(() => UrlsService))
        private readonly urlsService: UrlsService
    ) { }

    // GET /urls/:code/analytics?days=30
    @Get()
    async getAnalytics(
        @Param('code') code: string,
        @Query('days') days = '30',
        @CurrentUser() user: User,
    ) {
        const url = await this.urlsService.getStats(code, user.id);

        const [byDay, byReferer] = await Promise.all([
            this.analyticsService.getClicksByDay(url.id, Number(days)),
            this.analyticsService.getTopReferers(url.id),
        ]);
        return {
            code: url.code,
            totalClicks: url.clicks,
            period: `Last ${days} days`,
            byDay,
            byReferer,
        };

    }

}

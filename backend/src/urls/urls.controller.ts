import {
    Controller, Post, Get, Delete, Param,
    Body, Res, UseGuards, HttpCode,
    Req
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Chapter 6
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';



@Controller('')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }
    // POST /urls
    @UseGuards(JwtAuthGuard)
    @Post('urls')
    create(@Body() dto: CreateUrlDto, @CurrentUser() user: User) {
        return this.urlsService.create(dto, user);
    }
    // GET /:code — public redirect
    @Get(':code')
    async redirect(@Param('code') code: string, @Res() res: Response, @Req() req: Request) {
        const originalUrl = await this.urlsService.redirect(code, req);
        return res.redirect(302, originalUrl);
    }
    // GET /urls/:code/stats
    @UseGuards(JwtAuthGuard)
    @Get('urls/:code/stats')
    getStats(@Param('code') code: string, @CurrentUser() user: User) {
        return this.urlsService.getStats(code, user.id);
    }
    // DELETE /urls/:code
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete('urls/:code')
    remove(@Param('code') code: string, @CurrentUser() user: User) {
        return this.urlsService.remove(code, user.id);
    }
}

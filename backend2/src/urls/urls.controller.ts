import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { CreateUrlDTO } from './dto/urls.dto'
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/users.entity';
import type { Response } from 'express';


@Controller('')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @Post('url')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUrl(@Body() body: CreateUrlDTO, @CurrentUser() user: User) {
        return this.urlsService.createUrl(body, user)
    }


    @Delete('delete-url/:shortUrl')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteUrl(@Param('shortUrl') shortUrl: string, @CurrentUser() user: User) {
        return this.urlsService.deleteUrl(shortUrl, user.id)
    }

    @Get('/:shortUrl')
    async getUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
        let originalUrl = await this.urlsService.redirect(shortUrl);
        
        // If the URL doesn't start with http:// or https://, Express treats it as a relative path.
        // We prepend http:// to ensure it redirects to an external site.
        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = `http://${originalUrl}`;
        }
        
        return res.redirect(HttpStatus.FOUND, originalUrl);
    }

    @Get('stats/:shortUrl')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUrlStats(@Param('shortUrl') shortUrl: string, @CurrentUser() user: User) {
        return this.urlsService.getStats(shortUrl, user.id)
    }

}

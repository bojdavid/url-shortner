import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { CreateUrlDTO } from './dto/urls.dto'
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/users.entity';


@Controller('')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @Post('url')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUrl(@Body() body: CreateUrlDTO, @CurrentUser() user: User) {
        return this.urlsService.createUrl(body, user)
    }


    @Delete('delete-url/:short-url')
    async deleteUrl(@Param('short-url') shortUrl: string, @CurrentUser() user: User) {
        return this.urlsService.deleteUrl(shortUrl, user.id)
    }

    @Get('/:short-url')
    async getUrl(@Param('short-url') shortUrl: string) {
        return this.urlsService.redirect(shortUrl)
    }

    @Get('stats/:short-url')
    async getUrlStats(@Param('short-url') shortUrl: string, @CurrentUser() user: User) {
        return this.urlsService.getStats(shortUrl, user.id)
    }

}

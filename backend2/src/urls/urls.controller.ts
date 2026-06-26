import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { CreateUrlDTO } from './dto/urls.dto'
import { UrlsService } from './urls.service';

@Controller('')
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) { }

    @Post('url')
    @HttpCode(HttpStatus.CREATED)
    async createUrl(@Body() body: CreateUrlDTO, @Req() req) {
        return this.urlsService.createUrl(body, req.user)
    }


    @Delete('delete-url/:short-url')
    async deleteUrl(@Param('short-url') shortUrl: string) {
        return { message: "this is where it deletes the url" }
    }

    @Get('/:short-url')
    async getUrl(@Param('short-url') shortUrl: string) {
        return { message: shortUrl }
    }

}

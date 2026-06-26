import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @HttpCode(200) // Login is a POST but returns 200, not 201
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
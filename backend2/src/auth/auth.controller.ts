import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post("register")
    @HttpCode(201)
    signUp(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @HttpCode(200)
    @Post("login")
    signIn(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}

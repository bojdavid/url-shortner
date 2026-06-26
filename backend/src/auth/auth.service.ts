import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const user = await this.usersService.create(dto.email, dto.password);
        // Don't return the password hash!
        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken: this.sign(user.id) };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken: this.sign(user.id) };
    }

    private sign(userId: string): string {
        return this.jwtService.sign({ sub: userId });
    }
}
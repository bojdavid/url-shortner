import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly usersService: UsersService) { }

    async register(dto: RegisterDto) {
        const user = await this.usersService.createUser(dto.email, dto.password);
        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken: this.jwtService.sign({ sub: user.id, email: user.email }) };

    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findUserbyEmail(dto.email);

        if (!user) throw new UnauthorizedException("Invalid credentials");
        const valid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!valid) throw new UnauthorizedException("Invalid credentials");
        const { passwordHash, ...safe } = user;
        return { user: safe, accessToken: this.jwtService.sign({ sub: user.id, email: user.email }) };

    }
}

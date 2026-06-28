import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService,
        cfg: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: cfg.get<string>('JWT_SECRET') || 'secretKey',
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findUserbyID(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
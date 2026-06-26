import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        cfg: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            // Extract token from: Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: cfg.get('JWT_SECRET') ?? '',
            ignoreExpiration: false, // reject expired tokens
        });
    }
    // Called after the JWT signature is verified
    // Whatever you return here is attached to req.user
    async validate(payload: { sub: string }) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException();
        return user; // becomes req.user
    }
}
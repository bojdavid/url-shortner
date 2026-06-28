import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/users.entity';

// Use as @CurrentUser() user: User in any guarded controller method.
// It extracts req.user — set by JwtStrategy.validate() above.
export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
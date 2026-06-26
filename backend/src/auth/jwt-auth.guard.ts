// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// AuthGuard('jwt') wires this Guard to the JwtStrategy above
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
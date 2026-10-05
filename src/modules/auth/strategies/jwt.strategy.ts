import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../common/interfaces/payload.interface.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return { userId: payload.userId, email: payload.email };
    }
}
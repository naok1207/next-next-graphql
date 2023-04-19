import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

type Payload = {
  sub: string;
  name: string;
  iat: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // NOTE: ExtractJwt.fromAuthHeaderAsBearerToken() でいけないのかなぁ？
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { headers: { authorization: string } }) => {
          let token = null;
          if (req && req.headers) {
            token = req.headers.authorization.split(' ')[1];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: Payload): unknown {
    return payload;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_TOKEN,
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: any) {
    const accessToken = req.get('authorization').replace('Bearer', '').trim();

    return { ...payload, accessToken };
  }
}

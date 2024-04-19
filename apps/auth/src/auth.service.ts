import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async login(user: UserDocument, res: Response) {
    const payload = {
      userId: user._id.toHexString(),
    };
    let expiresTime = this.configService.get('JWT_EXPIRATION_IN_SECONDS');
    
    const expires = new Date();
    expires.setSeconds(expiresTime);

    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION_IN_SECONDS') + 's',
    });
    res.cookie('Authentication', token, {
      httpOnly: true,
      expires: expires,
    });
  }
}

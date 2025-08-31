import { GlobalConfig } from '@/configs/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  validateUser(email: string, password: string) {
    const credentials = this.configService.get<GlobalConfig['auth']>('auth');

    if (!credentials) {
      throw new Error('Auth configuration not found');
    }

    if (email === credentials.email && password === credentials.password) {
      return { email };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  login(email: string) {
    const payload = { email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

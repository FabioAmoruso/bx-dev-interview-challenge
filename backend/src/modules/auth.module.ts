import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@/controllers/auth/auth.controller';
import { AuthService } from '@/services/auth/auth.service';
import { GlobalConfig } from '@/configs/types';
import { JwtStrategy } from '@/auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<GlobalConfig['auth']['secret']>('auth.secret')!,
        signOptions: {
          expiresIn:
            config.get<GlobalConfig['auth']['expiresIn']>('auth.expiresIn')!,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}

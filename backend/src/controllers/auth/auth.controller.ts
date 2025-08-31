import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { LoginDto } from '@/dtos/auth/login.dto';
import { AuthService } from '@/services/auth/auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    this.authService.validateUser(email, password);
    return this.authService.login(email);
  }
}

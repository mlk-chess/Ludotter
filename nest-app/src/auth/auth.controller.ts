import { Controller, Get, Post, Body } from '@nestjs/common';
import { createUserDto } from 'src/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() newUser : createUserDto) {
    return this.authService.register(newUser);
  }
}

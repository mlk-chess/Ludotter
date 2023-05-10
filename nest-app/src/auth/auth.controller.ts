import { Controller, Get, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { createUserDto } from 'src/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() newUser : createUserDto) {
    return this.authService.register(newUser);
  }
}

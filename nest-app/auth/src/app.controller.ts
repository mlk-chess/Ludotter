import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { createUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {


  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  @UsePipes(ValidationPipe)
  register(newUser : createUserDto) {
    return this.appService.register(newUser);
  }

}
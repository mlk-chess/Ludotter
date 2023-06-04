import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {


    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
  
    if (token){

      const user = await this.client.send({ cmd: 'verify' }, token).toPromise();

      if (user.user){
        request.user = user;
        return true
      }
    }
    return false;
  }
}


import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class StatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();
        if (response.error && response.error.hasOwnProperty('statusCode')) {
          const { statusCode } = response.error;

          httpResponse.status(statusCode);
          return response;
        }
        
        if (response.status && response.status.toString().match(/^[45]/)) {
          httpResponse.status(response.status);
        }

        return response;
      }),
    );
  }
}

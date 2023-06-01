import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        return new HttpException(exception.getResponse(),exception.getStatus())
    }
}
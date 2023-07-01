import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
export declare class RpcValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): HttpException;
}

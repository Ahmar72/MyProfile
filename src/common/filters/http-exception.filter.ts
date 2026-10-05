import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: Record<string, string> = {};

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const obj = res as any;
                message = obj.message || message;

                // class-validator errors
                if (Array.isArray(obj.message)) {
                    message = 'Validation failed';
                    obj.message.forEach((msg: string) => {
                        const [field] = msg.split(' ');
                        errors[field] = msg;
                    });
                }
            }
        }

        response.status(statusCode).json({
            statusCode,
            message,
            payload: {
                user: [],
                errors: Object.keys(errors).length ? errors : { general: message },
            },
        });
    }
}
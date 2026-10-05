import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
    statusCode: number;
    message: string;
    payload: T;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, StandardResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<StandardResponse<T>> {
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((data) => {
                // If controller returned { message, payload } shape
                if (data && typeof data === 'object' && 'message' in data) {
                    return {
                        statusCode: response.statusCode,
                        message: data.message,
                        payload: data.payload ?? {},
                    };
                }

                return {
                    statusCode: response.statusCode,
                    message: 'Success',
                    payload: data,
                };
            }),
        );
    }
}
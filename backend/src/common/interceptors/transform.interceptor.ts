import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    // Return the data as-is to match frontend expectations
    // The frontend expects the raw response, not wrapped in a data object
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}

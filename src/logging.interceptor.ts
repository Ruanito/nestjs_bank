import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  filterRequest(request: any): any {
    return {
      ...request,
      password: '***',
    };
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, header } = request;

    const requestStart = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const requestLog = {
          method,
          url,
          header,
          request: this.filterRequest(body),
          requestTime: Date.now() - requestStart,
          response,
        };

        this.logger.log(requestLog);
      }),
    );
  }
}

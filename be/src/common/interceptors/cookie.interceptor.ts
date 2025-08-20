import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data.cookies) {
          const response = context.switchToHttp().getResponse();
          data.cookies.forEach((cookie) => {
            response.cookie(cookie.name, cookie.value, cookie.options);
          });
          delete data.cookies;
        }
        return data;
      })
    );
  }
}

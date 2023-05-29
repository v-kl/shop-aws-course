import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error) => {
          if (error.status === 401) {
            this.notificationService.showError(
              'authorization required for this operation'
            );
            return;
          }
          if (error.status === 403) {
            this.notificationService.showError(
              'you need to be authorized to perfotm this operation'
            );
            return;
          }

          const url = new URL(request.url);
          this.notificationService.showError(
            `Request to "${url.pathname}" failed. Check the console for the details`,
            0
          );
        },
      })
    );
  }
}

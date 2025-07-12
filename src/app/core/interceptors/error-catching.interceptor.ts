import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { Problem } from '../models';
import { NotificationService } from '../services';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  private notifier = inject(NotificationService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((resp: HttpErrorResponse) => {
        let errorMsg = '';
        if (resp.error instanceof ErrorEvent) {
          // console.log('Client side error');
          errorMsg = `Erro: ${resp.error.message}`;
        } else {
          console.log(resp);
          const problem = resp.error as Problem;
          // console.log(`Server side error with status code ${problem.status}`);
          errorMsg = `${problem.title || 'Erro do servidor'}. ${problem.detail || ''}`;
        }
        this.notifier.showError(errorMsg);
        return EMPTY;
      }),
    );
  }
}

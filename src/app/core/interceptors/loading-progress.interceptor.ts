import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingProgressService } from '../services';

@Injectable()
export class LoadingProgressInterceptor implements HttpInterceptor {
  constructor(private loadingProgressService: LoadingProgressService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingProgressService.loadingOn();
    return next.handle(req).pipe(finalize(() => this.loadingProgressService.loadingOff()));
  }
}

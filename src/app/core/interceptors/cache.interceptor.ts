import { HttpContext, HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { share, tap } from 'rxjs/operators';

export const CACHE_IT = new HttpContextToken<boolean>(() => false);

export function cacheIt() {
  return new HttpContext().set(CACHE_IT, true);
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cacheData = new Map<string, any>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || !req.context.get(CACHE_IT)) {
      return next.handle(req);
    }

    if (req.headers.get('reset-cache')) {
      this.cacheData.delete(req.urlWithParams);
    }

    const lastResponse = this.cacheData.get(req.urlWithParams);
    if (lastResponse) {
      return lastResponse instanceof Observable ? lastResponse : of(lastResponse.clone());
    }

    const requestHandle = next.handle(req).pipe(
      tap(state => {
        if (state instanceof HttpResponse) {
          this.cacheData.set(req.urlWithParams, state.clone());
        }
      }),
      share(),
    );

    this.cacheData.set(req.urlWithParams, requestHandle);

    return requestHandle;
  }
}

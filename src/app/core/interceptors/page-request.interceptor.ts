import { HttpContext, HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PageRequest } from '../models';

export const PAGE_IT = new HttpContextToken<PageRequest | undefined>(() => undefined);

export function pageIt(page: PageRequest) {
  return new HttpContext().set(PAGE_IT, page);
}

@Injectable()
export class PageRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const pageRequest = req.context.get(PAGE_IT);
    if (req.method !== 'GET' || !pageRequest) {
      return next.handle(req);
    }
    let params = req.params;

    const { sorts, ...rest } = pageRequest;
    params = params.appendAll(rest);

    if (sorts) {
      sorts.forEach(({ field, direction }) => {
        params = params.append('sort', field);
        params = params.append(`${field}.dir`, direction ?? 'asc');
      });
    }
    req = req.clone({ params });

    return next.handle(req);
  }
}

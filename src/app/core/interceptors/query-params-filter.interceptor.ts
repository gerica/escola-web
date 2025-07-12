import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

const disallowed = ['null', 'object', 'undefined'];

export class QueryParamsFilterInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const { params } = req;

    const filteredParams = params
      .keys()
      .filter(key => this.paramsAllowed(params.get(key)))
      .reduce((reduced, key) => reduced.set(key, params.get(key) ?? ''), new HttpParams());

    req = req.clone({ params: filteredParams });

    return next.handle(req);
  }

  private paramsAllowed(value: any) {
    return value == '0' || (!!value && !disallowed.includes(value));
  }
}

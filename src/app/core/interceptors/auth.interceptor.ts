import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs'; // <--- Import catchError and throwError
import { Router } from '@angular/router'; // <--- Import Router
import { APP_TOKEN } from '../models';
import { AuthService } from '../services/auth.service'; // <--- Import your AuthService (adjust path if different)

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenSignal = inject(APP_TOKEN); // This is your signal for the token
  const authService = inject(AuthService); // <--- Inject AuthService
  const router = inject(Router);         // <--- Inject Router

  const token = tokenSignal();
  console.debug('Auth Interceptor Token:', token);

  let authReq = req; // Initialize authReq with the original request

  // Se o token existir, clona a requisição e adiciona o cabeçalho de autorização.
  if (token) {
    authReq = req.clone({ // Clone the request to add headers
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Pass the (potentially cloned) request to the next handler and add error handling
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse  ) => { // <--- Add catchError operator
      if (error.status === 401) {
        console.warn('401 Unauthorized error detected. Redirecting to login...');
        authService.logout(); // Call logout method from your AuthService
        router.navigate(['/login']); // Navigate to your login route
      }
      // Re-throw the error to ensure it propagates down to subscribers
      return throwError(() => error); // <--- Re-throw the error
    })
  );
};
import {
  HttpInterceptorFn
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentialsReq = req.clone({ withCredentials: true });

  // TODO : JWT

  return next(withCredentialsReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        // ❌ plus de redirection brute
        // 👉 on laisse AuthStore gérer (ex: user = null)
      }
      return throwError(() => error);
    })
  );
};


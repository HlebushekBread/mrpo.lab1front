import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if(jwtToken) {
    req = req.clone({
      setHeaders: {
        Autorization: 'Bearer $(jwtToken)'
      }
    });
  }
  return next(req);
};

function getJwtToken(): string | null {
  return localStorage.getItem('jwtToken')
}

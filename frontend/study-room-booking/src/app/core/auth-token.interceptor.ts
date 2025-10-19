import { HttpInterceptorFn } from '@angular/common/http';

import { safeStorage } from './storage';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = safeStorage.get('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};



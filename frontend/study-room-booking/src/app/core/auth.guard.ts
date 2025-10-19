import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { safeStorage } from './storage';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
    const token = safeStorage.get('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};



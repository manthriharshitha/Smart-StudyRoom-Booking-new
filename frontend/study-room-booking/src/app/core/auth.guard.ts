import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const hasStorage = typeof localStorage !== 'undefined';
  if (!hasStorage) {
    return true; // SSR: allow render; client will enforce
  }
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};



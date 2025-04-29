import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = await authService.getToken();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Check if user is authenticated 
  return true;
};

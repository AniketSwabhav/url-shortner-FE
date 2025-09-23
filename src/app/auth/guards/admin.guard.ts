import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated() && loginService.isAdmin() == true) {
    return true;
  }

  router.navigate(['/admin/dashboard']);
  return false;
};

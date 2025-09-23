import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

export const userGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
    const router = inject(Router);
  
    if (loginService.isAuthenticated() && loginService.isAdmin() == false) {
      return true;
    }
  
    router.navigate(['/user/dashboard']);
    return false;
};

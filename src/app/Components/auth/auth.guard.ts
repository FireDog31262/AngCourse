import { inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isAuth = this.authService.isAuthenticated();
    console.log('🛡️ AuthGuard.canActivate() called');
    console.log('Requested URL:', state.url);
    console.log('Is authenticated:', isAuth);

    // Return a UrlTree instead of imperatively navigating so the router can
    // perform the redirect as part of the same navigation.
    if (isAuth) {
      console.log('✅ Access granted to:', state.url);
      return true;
    }
    console.log('❌ Access denied, redirecting to /login');
    return this.router.createUrlTree(["/login"]);
  }
}

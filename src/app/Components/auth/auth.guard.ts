import { inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Return a UrlTree instead of imperatively navigating so the router can
    // perform the redirect as part of the same navigation.
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(["/login"]);
  }
}

import { inject, signal } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

export class AuthService {
  private user = signal<User | null>(null);
  loggedIn = new BehaviorSubject<boolean>(false);

  router = inject(Router);

  login(authData: AuthData) {
    // Simulate login
    this.user.set({ id: '1', email: authData.email, name: 'John Doe' });
    this.loggedIn.next(true);
    this.router.navigate(['/training']);
  }

  logout() {
    this.user.set(null);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user() };
  }

  registerUser(authData: AuthData) {
    // Simulate user registration
    this.user.set({ id: '2', email: authData.email, name: 'Jane Doe' });
    this.loggedIn.next(true);
    this.router.navigate(['/training']);
  }

  isAuthenticated() {
    return this.user() !== null;
  }
}

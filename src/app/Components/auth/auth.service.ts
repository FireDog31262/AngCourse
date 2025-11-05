import { inject, Injectable, signal } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<User | null>(null);
  loggedIn = new Subject<boolean>();

  router = inject(Router);

  login(authData: AuthData) {
    // Simulate login
    console.log('🔐 AuthService.login() called');
    // const user =
    // this.user.set({ id: '1', email: authData.email, name: 'John Doe' });
    console.log('✅ User set:', this.user());
    this.loggedIn.next(true);
    console.log('📡 loggedIn.next(true) called');
    console.log('🧭 Navigating to /training...');
    this.router.navigate(['/training']).then(success => {
      console.log('🧭 Navigation result:', success);
    });
  }

  logout() {
    this.user.set(null);
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  getUser() {
    return { ...this.user() };
  }

  registerUser(user: User) {
    // Simulate user registration
    this.user.set({ ...user });
    this.loggedIn.next(true);
    this.router.navigate(['/training']);
  }

  isAuthenticated() {
    const authenticated = this.user() !== null;
    return authenticated;
  }
}

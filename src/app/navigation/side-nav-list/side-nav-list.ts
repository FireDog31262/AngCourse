import { MatListModule } from '@angular/material/list';
import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Components/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav-list',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-nav-list.html',
  styleUrl: './side-nav-list.less'
})
export class SideNavList implements OnInit, OnDestroy {
  authService = inject(AuthService);
  sidenav = input.required<MatSidenav>();
  loggedin = signal<boolean>(false);
  subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(this.authService.loggedIn.subscribe((isLoggedIn) => {
      this.loggedin.set(isLoggedIn);
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  logout() {
    const sidenav = this.sidenav();
    sidenav.close();
    this.authService.logout();
  }
}

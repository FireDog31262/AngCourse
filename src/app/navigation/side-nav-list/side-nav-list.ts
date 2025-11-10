import { MatListModule } from '@angular/material/list';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Components/auth/auth.service';

@Component({
  selector: 'app-side-nav-list',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-nav-list.html',
  styleUrl: './side-nav-list.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavList {
  private readonly authService = inject(AuthService);
  sidenav = input.required<MatSidenav>();
  protected readonly isLoggedIn = this.authService.isLoggedIn;

  logout() {
    const sidenav = this.sidenav();
    if (sidenav) {
      sidenav.close();
    }
    this.authService.logout();
  }
}

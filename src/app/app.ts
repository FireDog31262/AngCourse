import { Header } from './navigation/header/header';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SideNavList } from './navigation/side-nav-list/side-nav-list';
// NgRx store is provided via app.config.ts using provideStore

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    SideNavList,
    Header,
  // StoreModule.forRoot is not used in standalone components
],
  templateUrl: './app.html',
  styleUrls: ['./app.less'],
  animations: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
}

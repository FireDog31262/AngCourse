import { Header } from './navigation/header/header';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { ExtendedModule } from "@angular/flex-layout";
import { SideNavList } from './navigation/side-nav-list/side-nav-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    ExtendedModule,
    SideNavList,
    Header
],
  templateUrl: './app.html',
  styleUrls: ['./app.less'],
  animations: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
}

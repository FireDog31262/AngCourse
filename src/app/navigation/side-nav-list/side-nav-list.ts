import { MatListModule } from '@angular/material/list';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav-list',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-nav-list.html',
  styleUrl: './side-nav-list.less'
})
export class SideNavList {
  sidenav = input.required<MatSidenav>();
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.less'],
  animations: [
    trigger('iconRotate', [
      state('menu', style({
        transform: 'rotate(0deg)'
      })),
      state('close', style({
        transform: 'rotate(180deg)'
      })),
      transition('menu <=> close', animate('500ms ease-in-out'))
    ])
  ]
})
export class App {
  protected readonly title = signal('AngularCourse');
}

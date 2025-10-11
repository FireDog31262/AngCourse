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
    trigger('fadeIcon', [
      state('visible', style({
        opacity: 1
      })),
      state('animating', style({
        opacity: 0.5
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('visible => animating', animate('200ms ease-out')),
      transition('animating => hidden', animate('200ms ease-out')),
      transition('hidden => visible', animate('0ms'))
    ])
  ]
})
export class App {
  protected readonly title = signal('AngularCourse');
  protected menuIconState = signal<'visible' | 'animating' | 'hidden'>('hidden');
  protected closeIconState = signal<'visible' | 'animating' | 'hidden'>('visible');

  onSidenavOpenStart() {
    // Open animation starts: menu icon opacity = 0, close icon opacity = 1
    this.menuIconState.set('hidden');
    this.closeIconState.set('visible');
  }

  onSidenavOpenDone() {
    // Opening done: keep close icon visible
    this.closeIconState.set('visible');
  }

  onSidenavCloseStart() {
    // Close animation starts: close icon opacity goes to 0
    this.closeIconState.set('animating');
    // Menu icon stays hidden during closing
    this.menuIconState.set('hidden');
  }

  onSidenavCloseDone() {
    // Close animation ends: menu icon opacity = 1, close icon opacity = 0
    this.closeIconState.set('hidden');
    this.menuIconState.set('visible');
  }
}

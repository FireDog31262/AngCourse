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
    // Hide menu icon immediately when opening starts
    this.menuIconState.set('hidden');
    // Start animating close icon from visible to hidden
    this.closeIconState.set('animating');
  }

  onSidenavOpenDone() {
    // Show close icon when opening animation finishes
    this.closeIconState.set('visible');
  }

  onSidenavCloseStart() {
    // Hide close icon immediately when closing starts
    this.closeIconState.set('animating');
    // Keep menu icon hidden
    this.menuIconState.set('hidden');
  }

  onSidenavCloseDone() {
    // Show menu icon when closing animation finishes
    this.closeIconState.set('hidden');
    this.menuIconState.set('visible');
  }
}

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
    ]),
    trigger('rotateCloseIcon', [
      state('open', style({
        transform: 'translate(-50%, -50%) rotate(180deg)',
        opacity: 1
      })),
      state('closing', style({
        transform: 'translate(-50%, -50%) rotate(180deg)',
        opacity: 0.5
      })),
      state('closed', style({
        transform: 'translate(-50%, -50%) rotate(180deg)',
        opacity: 0
      })),
      state('opening', style({
        transform: 'translate(-50%, -50%) rotate(0deg)',
        opacity: 0
      })),
      transition('open => opening', animate('400ms ease-in-out')),
      transition('closing => closed', animate('200ms ease-out')),
      transition('closed => open', animate('0ms'))
    ])
  ]
})
export class App {
  protected readonly title = signal('AngularCourse');
  protected menuIconState = signal<'visible' | 'animating' | 'hidden'>('hidden');
  protected closeIconRotateState = signal<'open' | 'opening' | 'closing' | 'closed'>('open');

  onSidenavOpenStart() {
    // Open animation starts: menu icon opacity = 0, close icon opacity = 0 and rotates
    this.menuIconState.set('hidden');
    this.closeIconRotateState.set('opening');
  }

  onSidenavOpenDone() {
    // Opening done: close icon visible and rotated 180 degrees
    this.closeIconRotateState.set('open');
  }

  onSidenavCloseStart() {
    // Close animation starts: close icon opacity goes to 0
    this.closeIconRotateState.set('closing');
    // Menu icon stays hidden during closing
    this.menuIconState.set('hidden');
  }

  onSidenavCloseDone() {
    // Close animation ends: menu icon opacity = 1, close icon opacity = 0
    this.closeIconRotateState.set('closed');
    this.menuIconState.set('visible');
  }
}

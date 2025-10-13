import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { ExtendedModule } from "@angular/flex-layout";

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
    ExtendedModule
],
  templateUrl: './app.html',
  styleUrls: ['./app.less'],
  animations: [
    trigger('fadeIcon', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('150ms cubic-bezier(.4,0,.2,1)'))
    ]),
    trigger('rotateCloseIcon', [
      state(
        'open',
        style({
          transform: 'translate(-50%, -50%) rotate(180deg)',
          opacity: 1
        })
      ),
      state(
        'closed',
        style({
          transform: 'translate(-50%, -50%) rotate(0deg)',
          opacity: 0
        })
      ),
      transition(
        'closed => open',
        animate('300ms 50ms cubic-bezier(.4,0,.2,1)')
      ),
      transition('open => closed', animate('300ms cubic-bezier(.4,0,.2,1)'))
    ])
  ]
})
export class App implements OnDestroy {
  private readonly CLOSE_ANIM_MS = 300;
  private readonly MENU_FADE_MS = 150; // must be <= 80% target
  private menuFadeTimer: number | undefined;
  protected readonly title = signal('AngularCourse');
  protected menuIconState = signal<'visible' | 'hidden'>('visible');
  protected closeIconRotateState = signal<'closed' | 'open'>('closed');

  onSidenavOpenStart() {
    // Start opening: hide menu icon and rotate close icon into view
    if (this.menuFadeTimer) {
      window.clearTimeout(this.menuFadeTimer);
      this.menuFadeTimer = undefined;
    }
    this.menuIconState.set('hidden');
    this.closeIconRotateState.set('open');
  }

  onSidenavOpenDone() {
    // Ensure final state is open
    this.closeIconRotateState.set('open');
  }

  onSidenavCloseStart() {
    // Start closing: rotate back and then hide close icon
    this.closeIconRotateState.set('closed');
    // Menu icon stays hidden during closing
    this.menuIconState.set('hidden');
    // Ensure menu icon reaches opacity 1 by 80% of close animation
    const targetMs = Math.max(
      0,
      Math.floor(this.CLOSE_ANIM_MS * 0.8 - this.MENU_FADE_MS)
    );
    if (this.menuFadeTimer) {
      window.clearTimeout(this.menuFadeTimer);
    }
    this.menuFadeTimer = window.setTimeout(() => {
      this.menuIconState.set('visible');
      this.menuFadeTimer = undefined;
    }, targetMs);
  }

  onSidenavCloseDone() {
    // Close animation ends: show menu icon
    this.menuIconState.set('visible');
  }

  ngOnDestroy(): void {
    if (this.menuFadeTimer) {
      window.clearTimeout(this.menuFadeTimer);
    }
  }
}

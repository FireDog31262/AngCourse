import { AuthService } from './../../Components/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ExtendedModule } from '@angular/flex-layout';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    ExtendedModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.less'],
  animations: [
    trigger('fadeIcon', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('150ms cubic-bezier(.4,0,.2,1)')),
    ]),
    trigger('rotateCloseIcon', [
      state(
        'open',
        style({
          transform: 'translate(-50%, -50%) rotate(180deg)',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          transform: 'translate(-50%, -50%) rotate(0deg)',
          opacity: 0,
        })
      ),
      transition('closed => open', animate('300ms 50ms cubic-bezier(.4,0,.2,1)')),
      transition('open => closed', animate('300ms cubic-bezier(.4,0,.2,1)')),
    ]),
  ],
})
export class Header implements OnInit, OnDestroy {
  sidenav = input.required<MatSidenav>();
  authService = inject(AuthService);
  loggedIn = signal<boolean>(false);

  protected menuIconState = signal<'visible' | 'hidden'>('visible');
  protected closeIconRotateState = signal<'closed' | 'open'>('closed');

  private readonly CLOSE_ANIM_MS = 300;
  private readonly MENU_FADE_MS = 150; // must be <= 80% target
  private menuFadeTimer: number | undefined;
  private subs = new Subscription();

  ngOnInit(): void {
    const s = this.sidenav();    // Wire to sidenav lifecycle to coordinate animations
    this.subs.add(s.openedStart.subscribe(() => this.onSidenavOpenStart()));
    this.subs.add(
      s.openedChange.subscribe((opened) =>
        opened ? this.onSidenavOpenDone() : this.onSidenavCloseDone()
      )
    );
    this.subs.add(s.closedStart.subscribe(() => this.onSidenavCloseStart()));
    this.subs.add(this.authService.loggedIn.subscribe((isLoggedIn) => {
      this.loggedIn.set(isLoggedIn);
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.menuFadeTimer) {
      window.clearTimeout(this.menuFadeTimer);
    }
  }

  private onSidenavOpenStart() {
    // Start opening: hide menu icon and rotate close icon into view
    if (this.menuFadeTimer) {
      window.clearTimeout(this.menuFadeTimer);
      this.menuFadeTimer = undefined;
    }
    this.menuIconState.set('hidden');
    this.closeIconRotateState.set('open');
  }

  private onSidenavOpenDone() {
    // Ensure final state is open
    this.closeIconRotateState.set('open');
  }

  private onSidenavCloseStart() {
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

  private onSidenavCloseDone() {
    // Close animation ends: show menu icon
    this.menuIconState.set('visible');
  }

  logOut() {
    this.authService.logout();
  }
}

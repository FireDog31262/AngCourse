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
      state('hidden', style({
        opacity: 0
      })),
      transition('hidden => visible', animate('0ms')),
      transition('visible => hidden', animate('0ms'))
    ])
  ]
})
export class App {
  protected readonly title = signal('AngularCourse');
  protected showMenuIcon = signal(false);
  protected showCloseIcon = signal(true);
  private animationTimeout?: number;

  onSidenavAnimationStart(opened: boolean) {
    // Clear any pending timeout
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    // Hide both icons initially
    this.showMenuIcon.set(false);
    this.showCloseIcon.set(false);

    // Show the appropriate icon after 50% of animation (200ms out of 400ms default)
    this.animationTimeout = setTimeout(() => {
      if (opened) {
        // Opening: show close icon at 50% progress
        this.showCloseIcon.set(true);
      } else {
        // Closing: show menu icon at 50% progress
        this.showMenuIcon.set(true);
      }
    }, 200) as unknown as number;
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [NgOptimizedImage],
  templateUrl: './welcome.html',
  styleUrl: './welcome.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Welcome {
  protected readonly heroImage = 'images/welcome-hero.svg';
}

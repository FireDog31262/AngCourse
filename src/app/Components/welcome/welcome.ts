import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FlexLayoutModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Welcome {

}

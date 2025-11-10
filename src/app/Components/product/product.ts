import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Product {

}

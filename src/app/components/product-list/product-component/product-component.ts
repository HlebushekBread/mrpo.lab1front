import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.type'

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product-component.html',
  styleUrl: './product-component.scss',
})
export class ProductComponent {
  @Input() product!: Product;
}

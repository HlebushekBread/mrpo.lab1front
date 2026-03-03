import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.type'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-component',
  imports: [CommonModule],
  templateUrl: './product-component.html',
  styleUrl: './product-component.scss',
})
export class ProductComponent {
  @Input() product!: Product;

  navigationState = history.state;
}

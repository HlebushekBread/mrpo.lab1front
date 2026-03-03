import { Component, inject } from '@angular/core';
import { ProductService } from "../../services/product-service";
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product-component/product-component';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList{
  private productService = inject(ProductService);

  productList$ = this.productService.getAll();
}

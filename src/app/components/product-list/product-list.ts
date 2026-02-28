import { Component, OnInit, Signal, signal } from '@angular/core';
import { ProductComponent } from "../product-component/product-component";
import { ProductService } from "../../services/product-service";

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit{
  constructor(private productService: ProductService) {}
  
  productList: any;

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.productList = this.productService.getAll();
  }
}

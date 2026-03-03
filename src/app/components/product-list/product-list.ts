import { Component, effect, ElementRef, inject, viewChildren } from '@angular/core';
import { ProductService } from "../../services/product-service";
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product-component/product-component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList{

  private productService = inject(ProductService);

  productList = toSignal(this.productService.getAll(), {initialValue: []});

  elements = viewChildren<ElementRef>('card');

  constructor() {
    effect(() => {
      const allElements = this.elements(); 
      const targetArticle = history.state.article;

      if (allElements.length > 0 && targetArticle) {
        const target = allElements.find(el => el.nativeElement.id === targetArticle);
        target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

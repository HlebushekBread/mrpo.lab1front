import { Component, computed, effect, ElementRef, inject, Signal, signal, viewChildren } from '@angular/core';
import { ProductService } from "../../services/product-service";
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product-component/product-component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { take } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList{
  private router = inject(Router)
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  isEditProducts = computed(() => 
    this.authService.getTokenAuthorities().includes("EDIT_PRODUCTS")
  );

  errorMessage = signal("");

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

  createProduct(article: string) {
    const articleRegix = /^[A-Z0-9]+$/;
    this.productService.getAllArticles().subscribe({
      next: (articles: string[]) => {
        if(!article) {
          this.router.navigate(["/products/create"]);
        } else if (!articleRegix.test(article.toUpperCase())) {
          this.errorMessage.set("Ошибка: в артикуле присутствуют недопустимые символы.\n Используйте только A-Z и 0-9");
        } else if(article.length != 6) {
          this.errorMessage.set("Ошибка: артикул должен быть длиной в 6 символов");
        } else if (articles.includes(article.toUpperCase())) {
          this.errorMessage.set("Ошибка: товар с таким артикулом уже существует");
        } else {
          this.errorMessage.set("");
          const navigationExtras: NavigationExtras = {
            state: {article: article.toUpperCase()}
          };
          this.router.navigate(["/products/create"], navigationExtras);
        }
      },
      error: (err) => console.error(err)
    });
  }
}

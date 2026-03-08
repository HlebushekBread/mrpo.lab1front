import { Component, inject, input, OnInit, computed } from '@angular/core';
import { Product } from '../../../models/product.type'
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../services/image-service';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-product-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-component.html',
  styleUrl: './product-component.scss',
})
export class ProductComponent {
  private router = inject(Router);
  private imageService = inject(ImageService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  product = input.required<Product>();

  isMakeOrders = computed(() => 
    this.authService.getTokenAuthorities().includes("MAKE_ORDERS")
  );

  isEditProducts = computed(() => 
    this.authService.getTokenAuthorities().includes("EDIT_PRODUCTS")
  );

  imageUrl = toSignal(
    toObservable(this.product).pipe(
      switchMap(p => this.imageService.getImageLink(p?.article))
    ),
    { initialValue: { url: 'placeholder.png' } }
  );

  navigationState = history.state;

  editProduct(article: string) {
    this.router.navigate(["products/edit/", article]);
  }

  getProductCount(article: string): number {
    return this.cartService.getCountByArticle(article);
  }

  addToCart(article: string) {
    if(this.cartService.items().length<10) {
      this.cartService.addToCart(article);
    }
  }

  incrementCount(article: string) {
    if(this.cartService.getCountByArticle(article)<20) {
      this.cartService.updateCount(this.product().article, 1);
    }
  }

  decrementCount(article: string) {
    this.cartService.updateCount(article, -1);
  }
}
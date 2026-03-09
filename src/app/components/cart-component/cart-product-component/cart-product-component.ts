import { Component, inject, input, computed } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ImageService } from '../../../services/image-service';
import { CartService } from '../../../services/cart-service';
import { Product } from '../../../services/product-service';

@Component({
  selector: 'app-cart-product-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-product-component.html',
  styleUrl: './cart-product-component.scss',
})
export class CartProductComponent {
  private router = inject(Router);
  private cartService = inject(CartService);
  private imageService = inject(ImageService);

  product = input.required<Product>();
  amount = input.required<number>();

  imageUrl = toSignal(
    toObservable(this.product).pipe(switchMap((p) => this.imageService.getImageLink(p?.article))),
    { initialValue: { url: 'placeholder.png' } },
  );

  currentCount = computed(() => this.cartService.getCountByArticle(this.product().article));

  openProduct() {
    const navigationExtras: NavigationExtras = {
      state: { article: this.product().article },
    };
    this.router.navigate(['/products'], navigationExtras);
  }

  incrementCount() {
    if (this.currentCount() < 20) {
      this.cartService.updateCount(this.product().article, 1);
    }
  }

  decrementCount() {
    if (this.currentCount() > 1) {
      this.cartService.updateCount(this.product().article, -1);
    }
  }
}

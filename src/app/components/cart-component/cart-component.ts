import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { Product, ProductService } from '../../services/product-service';
import { CartProductComponent } from './cart-product-component/cart-product-component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartProductComponent, CommonModule],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.scss'],
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private productDetails = signal<Map<string, Product>>(new Map());

  readonly cartItems = this.cartService.items;

  readonly fullCartItems = computed(() => {
    return this.cartItems()
      .map((item) => ({
        ...item,
        product: this.productDetails().get(item.article),
      }))
      .filter(
        (item): item is { count: number; article: string; product: Product } =>
          item.product !== undefined,
      );
  });

  readonly totalPrice = computed(() => {
    return this.fullCartItems().reduce(
      (acc, item) => {
        const productInfo = this.productDetails().get(item.article);
        const price = productInfo ? productInfo.price : 0;
        const discount = productInfo ? productInfo.discount || 0 : 0;

        const itemTotalBase = price * item.count;
        const itemTotalDiscounted = price * (1 - discount / 100) * item.count;

        acc.subtotal += itemTotalBase;
        acc.total += itemTotalDiscounted;
        return acc;
      },
      { subtotal: 0, total: 0 },
    );
  });

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    const articles = this.cartItems().map((i) => i.article);
    if (articles.length === 0) return;

    const requests = articles.map((art) => this.productService.getByArticle(art));

    forkJoin(requests).subscribe((products) => {
      const newMap = new Map(this.productDetails());
      products.forEach((p) => newMap.set(p.article, p));
      this.productDetails.set(newMap);
    });
  }

  increment(article: string) {
    this.cartService.updateCount(article, 1);
  }

  decrement(article: string) {
    this.cartService.updateCount(article, -1);
  }

  removeItem(article: string) {
    const count = this.cartService.getCountByArticle(article);
    this.cartService.updateCount(article, -count);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    console.log('Оформление заказа:', this.fullCartItems());
  }
}

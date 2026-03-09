import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { Product, ProductService } from '../../services/product-service';
import { CartProductComponent } from './cart-product-component/cart-product-component';
import { OrderService } from '../../services/order-service';
import { AuthService } from '../../services/auth-service';
import { NavigationExtras, Router } from '@angular/router';
import { AddressService } from '../../services/address-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartProductComponent, CommonModule],
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.scss'],
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  private productService = inject(ProductService);
  private productDetails = signal<Map<string, Product>>(new Map());

  readonly addresses = toSignal(this.addressService.getAll(), { initialValue: [] });

  readonly cartItems = this.cartService.items;

  readonly fullCartItems = computed(() => {
    return this.cartItems()
      .map((item) => ({
        ...item,
        product: this.productDetails().get(item.productArticle),
      }))
      .filter(
        (item): item is { amount: number; productArticle: string; product: Product } =>
          item.product !== undefined,
      );
  });

  readonly totalPrice = computed(() => {
    return this.fullCartItems().reduce(
      (acc, item) => {
        const productInfo = this.productDetails().get(item.productArticle);
        const price = productInfo ? productInfo.price : 0;
        const discount = productInfo ? productInfo.discount || 0 : 0;

        const itemTotalBase = price * item.amount;
        const itemTotalDiscounted = price * (1 - discount / 100) * item.amount;

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
    const articles = this.cartItems().map((i) => i.productArticle);
    if (articles.length === 0) return;

    const requests = articles.map((art) => this.productService.getByArticle(art));

    forkJoin(requests).subscribe((products) => {
      const newMap = new Map(this.productDetails());
      products.forEach((p) => {
        if (p && p.article) {
          newMap.set(p.article, p);
        }
      });
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
    const amount = this.cartService.getCountByArticle(article);
    this.cartService.updateCount(article, -amount);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout(addressId: string) {
    const userOrderDto = {
      addressId: Number(addressId),
      userId: this.authService.getTokenId(),
      orderProductDtos: this.cartItems(),
    };
    console.log('Оформление заказа:', userOrderDto);
    this.orderService.makeOrder(userOrderDto).subscribe({
      next: (response) => {
        const navigationExtras: NavigationExtras = {
          state: { id: response.id },
        };
        this.router.navigate(['/orders'], navigationExtras);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
    this.cartService.clearCart();
  }
}

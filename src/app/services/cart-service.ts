import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  productArticle: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'shoppingCart';

  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this.cartItems.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    });
  }

  private loadFromStorage(): CartItem[] {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Ошибка парсинга корзины из LocalStorage', e);
      return [];
    }
  }

  getCountByArticle(article: string): number {
    return this.cartItems().find((i) => i.productArticle === article)?.amount ?? 0;
  }

  addToCart(article: string) {
    this.cartItems.update((items) => {
      const existingItem = items.find((i) => i.productArticle === article);

      if (existingItem) {
        return items.map((i) =>
          i.productArticle === article ? { ...i, amount: i.amount + 1 } : i,
        );
      }

      return [...items, { productArticle: article, amount: 1 }];
    });
  }

  updateCount(article: string, delta: number) {
    this.cartItems.update((items) =>
      items
        .map((item) =>
          item.productArticle === article ? { ...item, amount: item.amount + delta } : item,
        )
        .filter((item) => item.amount > 0),
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}

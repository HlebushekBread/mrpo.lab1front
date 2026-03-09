import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  article: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'shopping_cart';

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
    return this.cartItems().find((i) => i.article === article)?.count ?? 0;
  }

  addToCart(article: string) {
    this.cartItems.update((items) => {
      const existingItem = items.find((i) => i.article === article);

      if (existingItem) {
        return items.map((i) => (i.article === article ? { ...i, count: i.count + 1 } : i));
      }

      return [...items, { article, count: 1 }];
    });
  }

  updateCount(article: string, delta: number) {
    this.cartItems.update((items) =>
      items
        .map((item) => (item.article === article ? { ...item, count: item.count + delta } : item))
        .filter((item) => item.count > 0),
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}

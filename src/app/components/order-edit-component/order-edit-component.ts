import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product, ProductService } from '../../services/product-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Order, OrderDto, OrderProductDto, OrderService } from '../../services/order-service';
import { switchMap } from 'rxjs';
import { AddressService } from '../../services/address-service';
import { StatusService } from '../../services/status-service';
import { UserService } from '../../services/user-service';
import { NavigationExtras, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-edit-component',
  imports: [CommonModule],
  templateUrl: './order-edit-component.html',
  styleUrl: './order-edit-component.scss',
})
export class OrderEditComponent implements OnInit {
  private router = inject(Router);
  private statusService = inject(StatusService);
  private addressService = inject(AddressService);
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  id = input.required<string>();
  id$ = toObservable(this.id);
  errorMessage = signal('');

  order = signal<Order | null>(null);
  orderProducts = signal<{ product: Product; amount: number }[]>([]);

  defaultOrder = {
    orderDate: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    address: { id: 1, fullAddress: '' },
    orderProducts: [],
    user: {
      id: 1,
      role: { id: 1, name: '' },
      fullName: '',
      username: '',
    },
    receiveCode: 0,
    status: { id: 1, name: '' },
  };

  ngOnInit(): void {
    if (this.id() === 'new') {
      this.order.set({ id: 0, ...this.defaultOrder });
      this.orderProducts.set([]);
    } else {
      this.id$.pipe(switchMap((id) => this.orderService.getById(id))).subscribe((order) => {
        this.order.set(order);
        this.orderProducts.set([...order.orderProducts]);
      });
    }
  }

  statuses = toSignal(this.statusService.getAll(), { initialValue: [] });
  addresses = toSignal(this.addressService.getAll(), { initialValue: [] });
  users = toSignal(this.userService.getAllUserUsers(), { initialValue: [] });
  products = toSignal(this.productService.getAll(), { initialValue: [] });

  addProduct() {
    const defaultProduct = this.products()[0];
    if (!defaultProduct) return;

    const newItem = {
      product: defaultProduct,
      amount: 1,
    };
    this.orderProducts.update((items) => [...items, newItem]);
  }

  removeProduct(index: number) {
    this.orderProducts.update((items) => items.filter((_, i) => i !== index));
  }

  updateItemAmount(index: number, amount: string) {
    this.orderProducts.update((items) => {
      const newItems = [...items];
      newItems[index].amount = Number(amount);
      return newItems;
    });
  }

  updateItemProduct(index: number, article: string) {
    const product = this.products().find((p: Product) => p.article === article);

    if (product && this.orderProducts()[index]) {
      this.orderProducts.update((items) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], product: product };
        return newItems;
      });
    }
  }

  readonly totalPrice = computed(() => {
    return this.orderProducts().reduce(
      (acc, item) => {
        const productInfo = this.products().find(
          (p: Product) => p.article === item.product.article,
        );
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

  submitForm(formDataRaw: {
    id: string;
    orderDate: string;
    deliveryDate: string;
    receiveCode: string;
    statusId: string;
    addressId: string;
    userId: string;
  }) {
    const orderProductsDtos: OrderProductDto[] = this.orderProducts().map((item) => ({
      productArticle: item.product.article,
      amount: Number(item.amount),
    }));

    const orderDto: OrderDto = {
      id: Number(formDataRaw.id),
      orderDate: formDataRaw.orderDate,
      deliveryDate: formDataRaw.deliveryDate,
      receiveCode: Number(formDataRaw.receiveCode),
      statusId: Number(formDataRaw.statusId),
      addressId: Number(formDataRaw.addressId),
      userId: Number(formDataRaw.userId),
      orderProductDtos: orderProductsDtos,
    };

    this.orderService.saveOrder(orderDto).subscribe({
      next: (response) => {
        const navigationExtras: NavigationExtras = {
          state: { id: response.id },
        };
        this.router.navigate(['/orders'], navigationExtras);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }

  revertChanges() {
    this.router.navigate(['/orders']);
  }

  deleteOrder() {
    this.orderService.deleteOrder(Number(this.id())).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }
}

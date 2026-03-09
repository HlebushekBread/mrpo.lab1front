import { Component, computed, effect, ElementRef, inject, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order-service';
import { OrderComponent } from './order-component/order-component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [OrderComponent, CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  elements = viewChildren<ElementRef>('order');

  constructor() {
    effect(() => {
      const allElements = this.elements();
      const targetId = String(history.state.id);

      if (allElements.length > 0 && targetId) {
        const target = allElements.find((el) => el.nativeElement.id === targetId);
        target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  isEditOrders = computed(() => this.authService.getTokenAuthorities().includes('EDIT_ORDERS'));

  isViewAllOrders = this.authService.getTokenAuthorities().includes('VIEW_ALL_ORDERS');

  orderList = toSignal(
    this.isViewAllOrders ? this.orderService.getAll() : this.orderService.getByUserId(),
    { initialValue: [] },
  );

  createOrder() {
    this.router.navigate(['/orders/edit/new']);
  }
}

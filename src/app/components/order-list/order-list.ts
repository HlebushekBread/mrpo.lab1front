import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order-service';
import { OrderComponent } from './order-component/order-component';
import { ProductComponent } from "../product-list/product-component/product-component";
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-order-list',
  imports: [OrderComponent, CommonModule, ProductComponent],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  isAllOrdersView = this.authService.getTokenAuthorities().includes("VIEW_ALL_ORDERS");
  
  orderList = toSignal(this.isAllOrdersView ? this.orderService.getAll() : this.orderService.getByUserId(), {initialValue: []});
  
}

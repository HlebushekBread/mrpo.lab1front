import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { OrderProductComponent } from './order-product-component/order-product-component';
import { Router } from '@angular/router';
import { Order } from '../../../services/order-service';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule, OrderProductComponent],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
})
export class OrderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  navigationState = history.state;

  isEditOrders = computed(() => this.authService.getTokenAuthorities().includes('EDIT_ORDERS'));

  order = input.required<Order>();

  editOrder(id: number) {
    this.router.navigate(['orders/edit/', id]);
  }
}

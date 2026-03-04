import { Component, inject, input, Input } from '@angular/core';
import { Order } from '../../../models/order.type';
import { CommonModule } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
})
export class OrderComponent {
  private router = inject(Router)

  order = input.required<Order>();

  openProduct(article: string) {
    const navigationExtras: NavigationExtras = {
      state: {article: article}
    };
    this.router.navigate(["/products"], navigationExtras);
  }
}

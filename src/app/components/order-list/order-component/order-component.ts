import { Component, inject, Input } from '@angular/core';
import { Order } from '../../../models/order.type';
import { CommonModule } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
})
export class OrderComponent {
  private router = inject(Router)

  @Input() order!: Order;

  openProduct(article: string) {
    const navigationExtras: NavigationExtras = {
      state: {article: article}
    };
    this.router.navigate(["/products"], navigationExtras);
  }
}

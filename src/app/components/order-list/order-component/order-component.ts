import { Component, Input } from '@angular/core';
import { Order } from '../../../models/order.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.scss',
})
export class OrderComponent {
  @Input() order!: Order;
}

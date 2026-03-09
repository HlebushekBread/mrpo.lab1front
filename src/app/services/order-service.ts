import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  orderDate: string;
  deliveryDate: string;
  address: {
    fullAddress: string;
    id: number;
  };
  orderProducts: {
    amount: number;
    id: number;
    product: {
      amount: number;
      article: string;
      category: { id: number; name: string };
      description: string;
      discount: number;
      manufacturer: { id: number; name: string };
      name: string;
      price: number;
      provider: { id: number; name: string };
      unit: { id: number; name: string };
    };
  }[];
  user: {
    id: number;
    role: { id: number; name: string };
    fullName: string;
    username: string;
  };
  receiveCode: number;
  status: { id: number; name: string };
}

export interface OrderDto {
  id: number;
  orderDate: string;
  deliveryDate: string;
  receiveCode: number;
  statusId: number;
  addressId: number;
  userId: number;
  orderProductDtos: {
    productArticle: string;
    amount: number;
  }[];
}

export interface OrderProductDto {
  productArticle: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:8080/api/orders/all`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`http://localhost:8080/api/orders/${id}`);
  }

  getByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:8080/api/orders/get`);
  }

  saveOrder(data: OrderDto): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`http://localhost:8080/api/orders/save`, data);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/orders/delete/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

export interface UserOrderDto {
  addressId: number;
  userId: number;
  orderProductDtos: OrderProductDto[];
}

export interface OrderDto {
  id: number;
  orderDate: string;
  deliveryDate: string;
  receiveCode: number;
  statusId: number;
  addressId: number;
  userId: number;
  orderProductDtos: OrderProductDto[];
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
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/all`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  getByUserId(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/get`);
  }

  makeOrder(data: UserOrderDto): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${environment.apiUrl}/orders/make`, data);
  }

  saveOrder(data: OrderDto): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(`${environment.apiUrl}/orders/save`, data);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/orders/delete/${id}`);
  }
}

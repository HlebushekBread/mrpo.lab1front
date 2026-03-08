import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/orders/all`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/orders/${id}`)
  }

  getByUserId(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/orders/get`);
  }

  saveOrder(data: any): Observable<any> {
    return this.http.put<any[]>(`http://localhost:8080/api/orders/save`, data);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any[]>(`http://localhost:8080/api/orders/delete/${id}`);
  }
 }

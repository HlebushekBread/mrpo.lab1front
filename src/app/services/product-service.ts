import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  article: string;
  name: string;
  unit: { id: number; name: string };
  price: number;
  provider: { id: number; name: string };
  manufacturer: { id: number; name: string };
  category: { id: number; name: string };
  discount: number;
  amount: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/get`);
  }

  getAllArticles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/products/articles`);
  }

  getByArticle(article: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${article}`);
  }

  saveProduct(data: FormData): Observable<{ article: string }> {
    return this.http.put<{ article: string }>(`${environment.apiUrl}/products/save`, data);
  }

  deleteProduct(article: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/delete/${article}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.get<Product[]>(`http://localhost:8080/api/products/get`);
  }

  getAllArticles(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/api/products/articles`);
  }

  getByArticle(article: string): Observable<Product> {
    return this.http.get<Product>(`http://localhost:8080/api/products/${article}`);
  }

  saveProduct(data: FormData): Observable<{ article: string }> {
    return this.http.put<{ article: string }>(`http://localhost:8080/api/products/save`, data);
  }

  deleteProduct(article: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/products/delete/${article}`);
  }
}

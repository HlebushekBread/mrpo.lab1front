import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService{
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/products/all`);
  }

  getByArticle(article: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/products/${article}`)
  }

  updateProduct(article: string, data: FormData): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/products/update/${article}`, data);
  }
}

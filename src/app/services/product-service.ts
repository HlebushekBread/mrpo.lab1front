import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService{
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/products/get`);
  }

  getAllArticles(): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/products/articles`)
  }

  getByArticle(article: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/products/${article}`)
  }

  saveProduct(data: FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/products/save`, data)
  }

  deleteProduct(article: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/products/delete/${article}`);
  }
}

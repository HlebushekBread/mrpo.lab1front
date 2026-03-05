import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDto } from '../dtos/productDto.type';

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

  createProduct(data: FormData): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/products/create`, data)
  }

  updateProduct(article: string, data: FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/products/update/${article}`, data);
  }

  deleteProduct(article: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/products/delete/${article}`);
  }
}

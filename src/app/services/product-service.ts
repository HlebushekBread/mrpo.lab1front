import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService{
  constructor(private http: HttpClient) {}

  productList: any[] = [123];

  getAll() {
    //https://jsonplaceholder.typicode.com/posts
    console.log(111);
    this.http.get('http://localhost:8080/api/products/all').pipe(take(1)).subscribe((data: any) => {
      this.productList = data;
    });
    return this.productList;
  }
}

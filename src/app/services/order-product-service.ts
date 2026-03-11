import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderProductService {
  private http = inject(HttpClient);

  getOrderIdsByProductArticle(article: string): Observable<number[]> {
    return this.http.get<number[]>(`${environment.apiUrl}/orderProducts/orders/${article}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getAll(): Observable<category[]> {
    return this.http.get<category[]>(`http://localhost:8080/api/categories/catalog`);
  }
}

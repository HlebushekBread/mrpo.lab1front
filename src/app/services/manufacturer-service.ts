import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface manufacturer {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  private http = inject(HttpClient);

  getAll(): Observable<manufacturer[]> {
    return this.http.get<manufacturer[]>(`http://localhost:8080/api/manufacturers/catalog`);
  }
}

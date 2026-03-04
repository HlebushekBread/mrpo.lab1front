import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  private http = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/manufacturers/catalog`);
  }
}

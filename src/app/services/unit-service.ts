import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface unit {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private http = inject(HttpClient);

  getAll(): Observable<unit[]> {
    return this.http.get<unit[]>(`http://localhost:8080/api/units/catalog`);
  }
}

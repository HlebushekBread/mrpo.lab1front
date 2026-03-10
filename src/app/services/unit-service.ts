import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<unit[]>(`${environment.apiUrl}/units/catalog`);
  }
}

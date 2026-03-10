import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<manufacturer[]>(`${environment.apiUrl}/manufacturers/catalog`);
  }
}

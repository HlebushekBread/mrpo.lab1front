import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface providerResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private http = inject(HttpClient);

  getAll(): Observable<providerResponse[]> {
    return this.http.get<providerResponse[]>(`http://localhost:8080/api/providers/catalog`);
  }
}

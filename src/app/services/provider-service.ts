import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<providerResponse[]>(`${environment.apiUrl}/providers/catalog`);
  }
}

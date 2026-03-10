import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface address {
  id: number;
  fullAddress: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient);

  getAll(): Observable<address[]> {
    return this.http.get<address[]>(`${environment.apiUrl}/addresses/catalog`);
  }
}

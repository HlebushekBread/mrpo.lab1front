import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.get<address[]>(`http://localhost:8080/api/addresses/catalog`);
  }
}

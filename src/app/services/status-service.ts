import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface status {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private http = inject(HttpClient);

  getAll(): Observable<status[]> {
    return this.http.get<status[]>(`${environment.apiUrl}/statuses/catalog`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getAllUserUsers(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/users/users`);
  }
}

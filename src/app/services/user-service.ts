import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  role: {
    id: number;
    name: string;
  };
  fullName: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getAllUserUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/users`);
  }
}

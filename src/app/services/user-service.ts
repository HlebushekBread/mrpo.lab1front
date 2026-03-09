import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.http.get<User[]>(`http://localhost:8080/api/users/users`);
  }
}

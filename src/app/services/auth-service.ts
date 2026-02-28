import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwtToken = "token";
  private loggedUser?: string;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private http = inject(HttpClient);

  constructor() {}

  login(user:{username: string, password: string}): Observable<any>{
    return this.http.post('localhost:8080/api/auth/login', user).pipe(
      tap((tokens) => this.doLoginUser(user.username, tokens))
    )
  }

  private doLoginUser(username: string, tokens: any){
    this.loggedUser = username;
    this.storeJwtToken(tokens.jwt);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(jwt: string){
    localStorage.setItem(this.jwtToken, jwt);
  }

  logout(){
    localStorage.removeItem(this.jwtToken);
    this.isAuthenticatedSubject.next(false);
  }
}

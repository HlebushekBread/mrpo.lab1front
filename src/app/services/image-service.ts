import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient)

  getImageLink(filename: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`http://localhost:8080/api/images/link/${filename}`);
  }
}

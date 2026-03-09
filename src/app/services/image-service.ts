import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private readonly placeholder = { url: 'placeholder.png' };

  getImageLink(filename: string | null | undefined): Observable<{ url: string }> {
    if (!filename) return of(this.placeholder);

    return this.http
      .get<{ url: string }>(`http://localhost:8080/api/images/link/${filename}`)
      .pipe(catchError(() => of(this.placeholder)));
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private readonly placeholder = { url: 'placeholder.png' };

  fixMinioUrl(originalUrl: string): string {
    if (!originalUrl) return '';

    const index = originalUrl.indexOf('/images');

    if (index !== -1) {
      return environment.imgUrl + originalUrl.substring(index + '/images'.length);
    }

    return originalUrl;
  }

  getImageLink(filename: string | null | undefined): Observable<{ url: string }> {
    if (!filename) return of(this.placeholder);

    return this.http.get<{ url: string }>(`${environment.apiUrl}/images/link/${filename}`).pipe(
      map((response) => ({
        url: this.fixMinioUrl(response.url),
      })),
      catchError(() => of(this.placeholder)),
    );
  }
}

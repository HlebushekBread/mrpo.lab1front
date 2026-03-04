import { Component, inject, input, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image-service';
import { AuthService } from '../../services/auth-service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Product } from '../../models/product.type';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-edit-component',
  imports: [CommonModule],
  templateUrl: './product-edit-component.html',
  styleUrl: './product-edit-component.scss',
})
export class ProductEditComponent {
  private router = inject(Router)
  private imageService = inject(ImageService);
  private productService = inject(ProductService);

  article = input.required<string>();

  private product$ = toObservable(this.article).pipe(
    switchMap(art => this.productService.getByArticle(art))
  );

  product = toSignal(this.product$);

  imageUrl = toSignal(
    this.product$.pipe(
      switchMap(p => {
        if (p?.image) {
          return this.imageService.getImageLink(p.image).pipe(
            catchError(() => of({ url: 'placeholder.png' }))
          );
        }
        return of({ url: 'placeholder.png' });
      }),
      map(res => res.url)
    ),
    { initialValue: 'placeholder.png' }
  );
}

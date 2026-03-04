import { Component, inject, input, OnInit, computed } from '@angular/core';
import { Product } from '../../../models/product.type'
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../services/image-service';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-component.html',
  styleUrl: './product-component.scss',
})
export class ProductComponent {
  private router = inject(Router);
  private imageService = inject(ImageService);
  private authService = inject(AuthService);

  // Сигнальный input (read-only снаружи)
  product = input.required<Product>();

  // Вычисляемое свойство на основе данных из AuthService
  isProductEdit = computed(() => 
    this.authService.getTokenAuthorities().includes("EDIT_PRODUCTS")
  );

  // Реактивная загрузка изображения при изменении product
  // Превращаем сигнал в observable, запрашиваем ссылку и превращаем обратно в сигнал
  imageUrl = toSignal(
    toObservable(this.product).pipe(
      switchMap(p => {
        if (p?.image) {
          return this.imageService.getImageLink(p.image).pipe(
            catchError(() => of({ url: 'placeholder.png' }))
          );
        }
        return of({ url: 'placeholder.png' });
      })
    ),
    { initialValue: { url: 'placeholder.png' } }
  );

  navigationState = history.state;

  editProduct(article: string) {
    this.router.navigate(["products/edit/", article]);
  }
}
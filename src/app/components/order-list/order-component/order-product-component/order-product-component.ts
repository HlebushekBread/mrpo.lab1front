import { Component, inject, input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ImageService } from '../../../../services/image-service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../services/product-service';

@Component({
  selector: 'app-order-product-component',
  imports: [CommonModule],
  templateUrl: './order-product-component.html',
  styleUrl: './order-product-component.scss',
})
export class OrderProductComponent {
  private router = inject(Router);
  private imageService = inject(ImageService);

  product = input.required<Product>();
  amount = input.required<number>();

  imageUrl = toSignal(
    toObservable(this.product).pipe(switchMap((p) => this.imageService.getImageLink(p?.article))),
    { initialValue: { url: 'placeholder.png' } },
  );

  openProduct(article: string) {
    const navigationExtras: NavigationExtras = {
      state: { article: article },
    };
    this.router.navigate(['/products'], navigationExtras);
  }
}

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

  product = input.required<Product>();

  isEditProducts = computed(() => 
    this.authService.getTokenAuthorities().includes("EDIT_PRODUCTS")
  );

  imageUrl = toSignal(
    toObservable(this.product).pipe(
      switchMap(p => this.imageService.getImageLink(p?.image))
    ),
    { initialValue: { url: 'placeholder.png' } }
  );

  navigationState = history.state;

  editProduct(article: string) {
    this.router.navigate(["products/edit/", article]);
  }
}
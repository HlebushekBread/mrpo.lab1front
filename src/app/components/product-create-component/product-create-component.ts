import { Component, inject, input, Input, signal } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ImageService } from '../../services/image-service';
import { AuthService } from '../../services/auth-service';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { Product } from '../../models/product.type';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UnitService } from '../../services/unit-service';
import { CategoryService } from '../../services/category-service';
import { ManufacturerService } from '../../services/manufacturer-service';
import { ProviderService } from '../../services/provider-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create-component.html',
  styleUrl: './product-create-component.scss',
})
export class ProductCreateComponent {
  private router = inject(Router)
  private unitService = inject(UnitService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);
  private providerService = inject(ProviderService);
  private imageService = inject(ImageService);
  private productService = inject(ProductService);

  article = signal(history.state.article || '');

  constructor() {
    if (!this.article()) {
      this.generateArticle();
    }
  }

  generateArticle(length: number = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.productService.getAllArticles().pipe(take(1)).subscribe({
      next: (articles: string[]) => {
        let result;
        do {
          result = '';
          
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
          }
        } while(articles.includes(result));
        
        this.article.set(result);
      },
      error: (err) => console.error(err)
    });
  }

  units = toSignal(this.unitService.getAll(), { initialValue: [] });
  categories = toSignal(this.categoryService.getAll(), { initialValue: [] });
  manufacturers = toSignal(this.manufacturerService.getAll(), { initialValue: [] });
  providers = toSignal(this.providerService.getAll(), { initialValue: [] });

  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  returnToShop() {
    this.router.navigate(["/products"])
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const extension = file.name.split('.').pop();
      const name = `${this.article}.${extension}`;

      this.selectedFile = new File([file], name, { type: file.type });

      if (this.previewUrl()) {
          URL.revokeObjectURL(this.previewUrl()!);
      }
      this.previewUrl.set(URL.createObjectURL(this.selectedFile));
      console.log('Файл загружен:', this.selectedFile.name);
    }
  }

  submitForm(formDataRaw: any) {
    const data = new FormData();

    const productDto = {
      article: formDataRaw.article,
      name: formDataRaw.name,
      categoryId: Number(formDataRaw.categoryId),
      description: formDataRaw.description,
      manufacturerId: Number(formDataRaw.manufacturerId),
      providerId: Number(formDataRaw.providerId),
      price: Number(formDataRaw.price),
      discount: Number(formDataRaw.discount),
      amount: Number(formDataRaw.amount),
      unitId: Number(formDataRaw.unitId),
      image: this.selectedFile?.name
    };

    const jsonBlob = new Blob([JSON.stringify(productDto)], {
      type: 'application/json'
    });

    data.append('product', jsonBlob);

    if (this.selectedFile) {
      data.append('image', this.selectedFile);
    }

    this.productService.createProduct(data).subscribe({
      next: () => {
        const navigationExtras: NavigationExtras = {
          state: {article: productDto.article }
        };
        this.router.navigate(["/products"], navigationExtras);
      },
      error: (err) => console.error('Ошибка Spring:', err)
    });
  }
}

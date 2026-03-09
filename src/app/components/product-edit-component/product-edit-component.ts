import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ImageService } from '../../services/image-service';
import { switchMap } from 'rxjs';
import { Product, ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UnitService } from '../../services/unit-service';
import { CategoryService } from '../../services/category-service';
import { ManufacturerService } from '../../services/manufacturer-service';
import { ProviderService } from '../../services/provider-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit-component.html',
  styleUrl: './product-edit-component.scss',
})
export class ProductEditComponent implements OnInit {
  private router = inject(Router);
  private unitService = inject(UnitService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);
  private providerService = inject(ProviderService);
  private imageService = inject(ImageService);
  private productService = inject(ProductService);

  article = input.required<string>();
  article$ = toObservable(this.article);
  errorMessage = signal('');

  product = signal<Product | null>(null);

  defaultProduct = {
    name: '',
    unit: { id: 1, name: '' },
    price: 0,
    provider: { id: 1, name: '' },
    manufacturer: { id: 1, name: '' },
    category: { id: 1, name: '' },
    discount: 0,
    amount: 0,
    description: '',
  };

  ngOnInit(): void {
    if (this.article() === 'new') {
      this.product.set({
        article: '000000',
        ...this.defaultProduct,
      });
    } else {
      this.article$
        .pipe(switchMap((article) => this.productService.getByArticle(article)))
        .subscribe((product) => this.product.set(product));
    }
  }

  units = toSignal(this.unitService.getAll(), { initialValue: [] });
  categories = toSignal(this.categoryService.getAll(), { initialValue: [] });
  manufacturers = toSignal(this.manufacturerService.getAll(), { initialValue: [] });
  providers = toSignal(this.providerService.getAll(), { initialValue: [] });

  private product$ = toObservable(this.article).pipe(
    switchMap((art) => this.productService.getByArticle(art)),
  );

  imageUrl = toSignal(
    this.product$.pipe(switchMap((p) => this.imageService.getImageLink(p?.article))),
    { initialValue: { url: 'placeholder.png' } },
  );

  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  revertChanges() {
    this.router.navigate(['/products']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      this.errorMessage.set('');
      const name = 'file';

      this.selectedFile = new File([file], name, { type: file.type });

      if (this.previewUrl()) {
        URL.revokeObjectURL(this.previewUrl()!);
      }
      this.previewUrl.set(URL.createObjectURL(this.selectedFile));
      console.log('Файл загружен:', this.selectedFile.name);
    } else {
      this.errorMessage.set('Пожалуйста, выберите корректное изображение');
    }
  }

  submitForm(formDataRaw: {
    article: string;
    name: string;
    categoryId: string;
    description: string;
    manufacturerId: string;
    providerId: string;
    price: string;
    discount: string;
    amount: string;
    unitId: string;
  }) {
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
    };

    const jsonBlob = new Blob([JSON.stringify(productDto)], {
      type: 'application/json',
    });

    data.append('product', jsonBlob);

    if (this.selectedFile) {
      data.append('image', this.selectedFile);
    }

    this.productService.saveProduct(data).subscribe({
      next: (response) => {
        const navigationExtras: NavigationExtras = {
          state: { article: response.article },
        };
        this.router.navigate(['/products'], navigationExtras);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }

  deleteProduct() {
    this.productService.deleteProduct(this.article()).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }
}

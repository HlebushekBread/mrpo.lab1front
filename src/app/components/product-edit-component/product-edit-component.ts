import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image-service';
import { filter, switchMap } from 'rxjs';
import { Product, ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UnitService } from '../../services/unit-service';
import { CategoryService } from '../../services/category-service';
import { ManufacturerService } from '../../services/manufacturer-service';
import { ProviderService } from '../../services/provider-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderProductService } from '../../services/order-product-service';

@Component({
  selector: 'app-product-edit-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit-component.html',
  styleUrl: './product-edit-component.scss',
})
export class ProductEditComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private unitService = inject(UnitService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);
  private providerService = inject(ProviderService);
  private imageService = inject(ImageService);
  private productService = inject(ProductService);
  private orderProductService = inject(OrderProductService);

  readonly units = toSignal(this.unitService.getAll(), { initialValue: [] });
  readonly categories = toSignal(this.categoryService.getAll(), { initialValue: [] });
  readonly manufacturers = toSignal(this.manufacturerService.getAll(), { initialValue: [] });
  readonly providers = toSignal(this.providerService.getAll(), { initialValue: [] });

  article = input.required<string>();
  article$ = toObservable(this.article);
  errorMessage = signal('');
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  ngOnInit(): void {
    if (this.article() !== 'new') {
      this.article$
        .pipe(switchMap((article) => this.productService.getByArticle(article)))
        .subscribe((product) => {
          this.patchForm(product);
        });
    }
  }

  productForm: FormGroup = this.formBuilder.group({
    article: ['000000'],
    name: [null, [Validators.required]],
    categoryId: [null, [Validators.required]],
    description: [null],
    manufacturerId: [null, [Validators.required]],
    providerId: [null, [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    amount: [0, [Validators.required, Validators.min(0)]],
    unitId: [null, [Validators.required]],
  });

  private patchForm(p: Product) {
    this.productForm.patchValue({
      article: p.article,
      name: p.name,
      categoryId: p.category?.id,
      description: p.description,
      manufacturerId: p.manufacturer?.id,
      providerId: p.provider?.id,
      price: p.price,
      discount: p.discount,
      amount: p.amount,
      unitId: p.unit?.id,
    });
  }

  product = signal<Product | null>(null);
  imageUrl = toSignal(
    toObservable(this.article).pipe(
      switchMap((art) => this.imageService.getImageLink(art === 'new' ? undefined : art)),
    ),
    { initialValue: { url: 'placeholder.png' } },
  );

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file?.type.startsWith('image/')) {
      this.selectedFile = file;
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
      this.previewUrl.set(URL.createObjectURL(file));
    } else {
      this.errorMessage.set('Некорректный формат изображения');
    }
  }

  submitForm() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const data = new FormData();
    const productDto = this.productForm.value;

    const jsonBlob = new Blob([JSON.stringify(productDto)], { type: 'application/json' });
    data.append('product', jsonBlob);
    if (this.selectedFile) data.append('image', this.selectedFile);

    this.productService.saveProduct(data).subscribe({
      next: (response) =>
        this.router.navigate(['/products'], { state: { article: response.article } }),
      error: (err) => console.error(err),
    });
  }

  revertChanges() {
    this.router.navigate(['/products']);
  }

  productOrders = toSignal(
    toObservable(this.article).pipe(
      filter((article) => article !== 'new'),
      switchMap((article) => this.orderProductService.getOrderIdsByProductArticle(article)),
    ),
    { initialValue: [] },
  );
  isDeletePossible = computed(() => {
    const orders = this.productOrders();
    return orders ? orders.length === 0 : false;
  });
  isDeleteModalOpen = signal(false);

  openConfirmation() {
    this.isDeleteModalOpen.set(true);
  }

  deleteProduct() {
    this.productService.deleteProduct(this.article()).subscribe({
      next: () => {
        this.isDeleteModalOpen.set(false);
        this.router.navigate(['/products']);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }
}

import { Component, computed, effect, ElementRef, inject, Signal, signal, viewChildren } from '@angular/core';
import { ProductService } from "../../services/product-service";
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product-component/product-component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.type';
import { UnitService } from '../../services/unit-service';
import { CategoryService } from '../../services/category-service';
import { ManufacturerService } from '../../services/manufacturer-service';
import { ProviderService } from '../../services/provider-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private router = inject(Router);
  private unitService = inject(UnitService);
  private categoryService = inject(CategoryService);
  private manufacturerService = inject(ManufacturerService);
  private providerService = inject(ProviderService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  searchQuery = signal("");
  selectedCategory = signal("");
  selectedProvider = signal("");
  selectedManufacturer = signal("");
  onlyInStock = signal(false);
  
  sortField = signal<string>("name");
  sortDirection = signal(1);

  errorMessage = signal("");

  isSearchAndSortProducts = computed(() => 
    this.authService.getTokenAuthorities().includes("SEARCH_AND_SORT_PRODUCTS")
  );
  isEditProducts = computed(() => 
    this.authService.getTokenAuthorities().includes("EDIT_PRODUCTS")
  );

  private rawProductList = toSignal(this.productService.getAll(), {initialValue: []});

  filteredProducts = computed(() => {
    let list = [...this.rawProductList()];

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.article.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query) ||
        p.manufacturer.name.toLowerCase().includes(query) ||
        p.provider.name.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory()) 
      list = list.filter(p => p.category.id.toString() === this.selectedCategory());
    
    if (this.selectedProvider()) 
      list = list.filter(p => p.provider.id.toString() === this.selectedProvider());

    if (this.selectedManufacturer()) 
      list = list.filter(p => p.manufacturer.id.toString() === this.selectedManufacturer());

    if (this.onlyInStock()) {
      list = list.filter(p => p.amount > 0);
    }

    const field = this.sortField();
    const dir = this.sortDirection();

    list.sort((a, b) => {
      let valA = this.getFieldValue(a, field);
      let valB = this.getFieldValue(b, field);

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return list;
  });

  units = toSignal(this.unitService.getAll(), { initialValue: [] });
  categories = toSignal(this.categoryService.getAll(), { initialValue: [] });
  manufacturers = toSignal(this.manufacturerService.getAll(), { initialValue: [] });
  providers = toSignal(this.providerService.getAll(), { initialValue: [] });

  elements = viewChildren<ElementRef>('card');

  constructor() {
    effect(() => {
      const allElements = this.elements(); 
      const targetArticle = history.state.article;

      if (allElements.length > 0 && targetArticle) {
        const target = allElements.find(el => el.nativeElement.id === targetArticle);
        target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  private getFieldValue(obj: any, field: string): any {
    if (field === 'priceWithDiscount') {
      return obj.price * (1 - obj.discount / 100);
    }
    return obj[field];
  }

  createProduct() {
    this.router.navigate(["/products/edit/new"]);
  }

  setSort(field: string) {
    if (this.sortField() === field) {
      this.sortDirection.update(d => d * -1);
    } else {
      this.sortField.set(field);
      this.sortDirection.set(1);
    }
  }
}

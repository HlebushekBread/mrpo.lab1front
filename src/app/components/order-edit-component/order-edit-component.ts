import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product, ProductService } from '../../services/product-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Order, OrderDto, OrderProductDto, OrderService } from '../../services/order-service';
import { switchMap } from 'rxjs';
import { AddressService } from '../../services/address-service';
import { StatusService } from '../../services/status-service';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-edit-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-edit-component.html',
  styleUrl: './order-edit-component.scss',
})
export class OrderEditComponent implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private statusService = inject(StatusService);
  private addressService = inject(AddressService);
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  readonly statuses = toSignal(this.statusService.getAll(), { initialValue: [] });
  readonly addresses = toSignal(this.addressService.getAll(), { initialValue: [] });
  readonly users = toSignal(this.userService.getAllUserUsers(), { initialValue: [] });
  readonly products = toSignal(this.productService.getAll(), { initialValue: [] });

  id = input.required<string>();
  id$ = toObservable(this.id);
  errorMessage = signal('');

  order = signal<Order | null>(null);
  orderProducts = signal<{ product: Product; amount: number }[]>([]);

  orderForm: FormGroup = this.formBuilder.group({
    id: [0],
    statusId: [null, Validators.required],
    receiveCode: [0, [Validators.required, Validators.min(0)]],
    orderDate: [new Date().toISOString().slice(0, 16), Validators.required],
    deliveryDate: [new Date().toISOString().slice(0, 16), Validators.required],
    addressId: [null, Validators.required],
    userId: [null, Validators.required],
    orderProducts: this.formBuilder.array([], Validators.required),
  });

  private formValue = toSignal(this.orderForm.valueChanges, {
    initialValue: this.orderForm.value,
  });

  ngOnInit(): void {
    if (this.id() !== 'new') {
      this.id$.pipe(switchMap((id) => this.orderService.getById(id))).subscribe((order) => {
        this.patchForm(order);
      });
    }
  }

  get orderProductsArray() {
    return this.orderForm.get('orderProducts') as FormArray;
  }

  private patchForm(order: Order) {
    this.orderForm.patchValue({
      id: order.id,
      statusId: order.status.id,
      receiveCode: order.receiveCode,
      orderDate: order.orderDate.slice(0, 16),
      deliveryDate: order.deliveryDate.slice(0, 16),
      addressId: order.address.id,
      userId: order.user.id,
    });

    const productControls = order.orderProducts.map((op) =>
      this.formBuilder.group({
        productArticle: [op.product.article, Validators.required],
        amount: [op.amount, [Validators.required, Validators.min(1)]],
      }),
    );

    this.orderForm.setControl('orderProducts', this.formBuilder.array(productControls));
  }

  addProduct() {
    const product = this.products()[0];
    if (!product) return;

    this.orderProductsArray.push(
      this.formBuilder.group({
        productArticle: [product.article, Validators.required],
        amount: [1, [Validators.required, Validators.min(1)]],
      }),
    );
  }

  removeProduct(index: number) {
    this.orderProductsArray.removeAt(index);
  }

  readonly totalPrice = computed(() => {
    const items = this.formValue()?.orderProducts || [];

    return items.reduce(
      (acc: { total: number; subtotal: number }, item: OrderProductDto) => {
        const p = this.products().find((prod) => prod.article === item.productArticle);
        if (!p) return acc;

        const amount = Number(item.amount) || 0;
        acc.subtotal += p.price * amount;
        acc.total += p.price * (1 - (p.discount || 0) / 100) * amount;
        return acc;
      },
      { subtotal: 0, total: 0 },
    );
  });

  submitForm() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const val = this.orderForm.value;
    const orderDto: OrderDto = {
      ...val,
      orderProductDtos: val.orderProducts,
    };

    this.orderService.saveOrder(orderDto).subscribe({
      next: (res) => this.router.navigate(['/orders'], { state: { id: res.id } }),
      error: (err) => console.error(err),
    });
  }

  revertChanges() {
    this.router.navigate(['/orders']);
  }

  deleteOrder() {
    this.orderService.deleteOrder(Number(this.id())).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (err) => console.error('Ошибка Spring:', err),
    });
  }
}

import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { LoginForm } from './components/login-form/login-form';
import { LogoutForm } from './components/logout-form/logout-form';
import { OrderList } from './components/order-list/order-list';
import { ProductEditComponent } from './components/product-edit-component/product-edit-component';
import { OrderEditComponent } from './components/order-edit-component/order-edit-component';
import { CartComponent } from './components/cart-component/cart-component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginForm,
  },
  {
    path: 'cart',
    pathMatch: 'full',
    component: CartComponent,
  },
  {
    path: 'products',
    pathMatch: 'full',
    component: ProductList,
  },
  {
    path: 'products/edit/:article',
    pathMatch: 'full',
    component: ProductEditComponent,
  },
  {
    path: 'orders',
    pathMatch: 'full',
    component: OrderList,
  },
  {
    path: 'orders/edit/:id',
    pathMatch: 'full',
    component: OrderEditComponent,
  },
  {
    path: 'logout',
    pathMatch: 'full',
    component: LogoutForm,
  },
];

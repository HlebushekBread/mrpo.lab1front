import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { LoginForm } from './components/login-form/login-form';
import { LogoutForm } from './components/logout-form/logout-form';
import { OrderList } from './components/order-list/order-list';
import { ProductEditComponent } from './components/product-edit-component/product-edit-component';
import { ProductCreateComponent } from './components/product-create-component/product-create-component';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: LoginForm
    },
    {
        path: "products",
        pathMatch: "full",
        component: ProductList
    },
    {
        path: "products/edit/:article",
        pathMatch: "full",
        component: ProductEditComponent
    },
    {
        path: "products/create",
        pathMatch: "full",
        component: ProductCreateComponent
    },
    {
        path: "orders",
        pathMatch: "full",
        component: OrderList
    },
    {
        path: "logout",
        pathMatch: "full",
        component: LogoutForm
    }
];

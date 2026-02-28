import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        pathMatch: "full",
        loadComponent: () => {
            return import("./components/login-form/login-form").then((m) => m.LoginForm);
        }
    },
    {
        path: "products",
        pathMatch: "full",
        loadComponent: () => {
            return import("./components/product-list/product-list").then((m) => m.ProductList);
        }
    }
];

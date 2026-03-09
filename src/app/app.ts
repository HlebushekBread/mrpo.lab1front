import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavBar } from './components/navbar/navbar';
import { filter } from 'rxjs';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (!this.authService.isAuthenticated() && event.url != '/') {
          this.router.navigate(['/']);
        } else {
          if (
            !this.authService.getTokenAuthorities().includes('EDIT_ORDERS') &&
            event.url.includes('/orders/edit')
          ) {
            this.router.navigate(['/orders']);
          }
          if (
            !this.authService.getTokenAuthorities().includes('EDIT_PRODUCTS') &&
            event.url.includes('/products/edit')
          ) {
            this.router.navigate(['/products']);
          }
          if (
            !this.authService.getTokenAuthorities().includes('MAKE_ORDERS') &&
            event.url == '/cart'
          ) {
            this.router.navigate(['/']);
          }
          if (
            !(
              this.authService.getTokenAuthorities().includes('VIEW_USER_ORDERS') ||
              this.authService.getTokenAuthorities().includes('VIEW_ALL_ORDERS')
            ) &&
            event.url == '/orders'
          ) {
            this.router.navigate(['/']);
          }
          if (
            !this.authService.getTokenAuthorities().includes('VIEW_PRODUCTS') &&
            event.url == '/products'
          ) {
            this.router.navigate(['/']);
          }
          if (this.authService.isAuthenticated() && event.url == '/') {
            this.router.navigate(['/logout']);
          }
        }
      });
  }
}

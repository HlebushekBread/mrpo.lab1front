import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-form',
  imports: [],
  templateUrl: './logout-form.html',
  styleUrl: './logout-form.scss',
})
export class LogoutForm implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);

  role = signal(this.authService.getTokenRole());
  fullName = signal(this.authService.getTokenFullName());

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()) {
      this.router.navigate(['/'])
    }
  }

  logout() {
    this.authService.logout();
  }
}

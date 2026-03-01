import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavBar {
  private authService = inject(AuthService);

  isAuthenticated = signal(this.authService.isAuthenticated());
  
  hasAuthority(authority: string){
    return this.authService.getTokenAuthorities().includes(authority);
  }
}

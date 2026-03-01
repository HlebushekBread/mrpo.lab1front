import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pipe, take } from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})

export class LoginForm implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router)

  errorMessage = signal("");

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  }) 

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/logout'])
    }
  }

  login(){
    if(this.loginForm.invalid) return;
    
    this.authService.login({
      username: this.loginForm.value.username || '',
      password: this.loginForm.value.password || ''
    }).pipe(take(1)).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (err) => {
        this.errorMessage.set("Ошибка: Неверное имя пользователя или пароль");
      }
    });
  }

  loginAsGuest(){
    this.authService.login({
      username: 'guest',
      password: 'guest'
    }).pipe(take(1)).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (err) => {
        this.errorMessage.set("Ошибка: Внутренняя ошибка сервера");
      }
    });
  }
}

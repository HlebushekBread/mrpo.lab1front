import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  private authService = inject(AuthService);

  login(){
    if(this.loginForm.invalid) return;

    this.authService.login({
      username: this.loginForm.value.username || '',
      password: this.loginForm.value.password || ''
    });
  }
}

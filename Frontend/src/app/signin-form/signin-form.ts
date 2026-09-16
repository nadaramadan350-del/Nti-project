import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-signin-form',
  styleUrl: './signin-form.css',
  templateUrl: './signin-form.html',
})
export class SigninForm {
  @ViewChild('loginForm') login!: NgForm;

  authService = inject(AuthService);

  errorMessage = signal('');


  onSubmit() {
    this.errorMessage.set('');

    this.authService.signin(this.login.value).subscribe({
      next: (res) => {
        console.log(res);
        this.login.reset();
      },
      error: (err) => {
        this.errorMessage.set('Failed to login, Please try again later.');
        console.log(err);
      },
    });
  }
}

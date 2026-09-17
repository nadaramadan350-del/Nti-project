import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);

  get currentRole(): string {
    return this.authService.getRole() || 'guest';
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }
}

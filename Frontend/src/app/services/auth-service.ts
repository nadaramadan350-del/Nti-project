import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Service()
export class AuthService {
  private baseUrl = '/api/v1/auth';

  private httpClient = inject(HttpClient);

  isLoggedInSignal = signal(false);

  private getDecodedToken() {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<any>(token);
    } catch {
      return null;
    }
  }
  getRole(): string | null {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      return savedRole;
    }

    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.role) {
      return null;
    }

    localStorage.setItem('userRole', decoded.role);
    return decoded.role;
  }

  private syncRoleFromToken() {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.role) {
      localStorage.removeItem('userRole');
      return null;
    }

    localStorage.setItem('userRole', decoded.role);
    return decoded.role;
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoggedInSignal.set(false);
      localStorage.removeItem('userRole');
      return false;
    }

    try {
      const decoded = this.getDecodedToken();
      const expirationDate = new Date(decoded.exp * 1000);

      if (expirationDate < new Date()) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.isLoggedInSignal.set(false);
        return false;
      }

      this.syncRoleFromToken();
      this.isLoggedInSignal.set(true);
      return true;
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      this.isLoggedInSignal.set(false);
      return false;
    }
  }

  router = inject(Router);
  signin(credentials: { email: string; password: string }) {
    return this.httpClient.post<any>(`${this.baseUrl}/signin`, credentials).pipe(
      tap((res) => {
        this.isLoggedInSignal.set(true);
        localStorage.setItem('token', res.token);

        const role = res?.data?.user?.role || this.syncRoleFromToken() || 'student';
        localStorage.setItem('userRole', role);

        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/student-dashboard']);
        }
      }),
    );
  }

  signup(userDate: FormData) {
    return this.httpClient.post<any>(`${this.baseUrl}/signup`, userDate).pipe(
      tap((res) => {
        this.isLoggedInSignal.set(true);
        localStorage.setItem('token', res.token);

        const role = res?.data?.user?.role || this.syncRoleFromToken() || 'student';
        localStorage.setItem('userRole', role);

        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      }),
    );
  }

  logout() {
    this.isLoggedInSignal.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
}

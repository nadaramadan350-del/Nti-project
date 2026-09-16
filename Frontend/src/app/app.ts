import { Component, inject, OnInit } from '@angular/core';
import { SigninForm } from './signin-form/signin-form';
import { SignupForm } from './signup-form/signup-form';
import { AddCourseForm } from './add-course-form/add-course-form';
import { AuthService } from './services/auth-service';
import { CourseManagement } from './course-management/course-management';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isLoggedIn();
  }
}

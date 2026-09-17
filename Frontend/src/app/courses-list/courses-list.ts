import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseInterface } from '../interfaces/course-interface';
import { CoursesService } from '../services/courses-service';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  imports: [],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.css',
})
export class CoursesList implements OnInit {
  courses = signal<CourseInterface[]>([]);
  enrolledCourseIds = signal<string[]>([]);

  courseService = inject(CoursesService);
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);

  errorMessage = signal('');

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses.set(data);

        if (this.authService.isLoggedIn()) {
          this.userService.getUserCourses().subscribe({
            next: (enrolledCourses) => {
              this.enrolledCourseIds.set(enrolledCourses.map((course) => course._id));
            },
            error: () => {
              this.enrolledCourseIds.set([]);
            },
          });
        }
      },
      error: (err) => {
        this.errorMessage.set('Failed to load courses. Please try again later.');

        console.error(err);
      },
    });
  }

  enroll(courseId: string) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/signin');
      return;
    }

    if (this.enrolledCourseIds().includes(courseId)) {
      alert('You are already enrolled in this course');
      return;
    }

      this.userService.addCourseToUser(courseId).subscribe({
        next: (courses) => {
          this.enrolledCourseIds.set(courses.map((course) => course._id));
          alert('Course added successfully');
        },
        error: (err) => {
          this.errorMessage.set('Cannot enroll in the course');
          alert(this.errorMessage());
          console.log(err);
        },
      });
  }

  showCourse(courseId: string){
    this.router.navigateByUrl(`course-details/${courseId}`);
  }

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourseIds().includes(courseId);
  }
}

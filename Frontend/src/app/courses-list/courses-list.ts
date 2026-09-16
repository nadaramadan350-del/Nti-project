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

  courseService = inject(CoursesService);

  errorMessage = signal('');

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load courses. Please try again later.');

        console.error(err);
      },
    });
  }

  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);

  enroll(courseId: string) {
    if (this.authService.isLoggedIn()) {
  
      this.userService.addCourseToUser(courseId).subscribe({
        next: (courses) => {
          console.log(courses);
          alert("Course added successfully")
        },
        error: (err)=>{
          this.errorMessage.set('Cannot enroll in the course');
          alert(this.errorMessage())
          console.log(err);
          
        }
      });
    } else {
      this.router.navigateByUrl('/signin');
    }
  }

  showCourse(courseId: string){
    this.router.navigateByUrl(`course-details/${courseId}`);
  }
}

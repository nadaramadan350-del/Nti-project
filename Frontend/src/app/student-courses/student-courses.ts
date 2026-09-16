import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseInterface } from '../interfaces/course-interface';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-student-courses',
  imports: [],
  templateUrl: './student-courses.html',
  styleUrl: './student-courses.css',
})
export class StudentCourses implements OnInit{

  courses = signal<CourseInterface[]>([]);

  userService = inject(UserService);


  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.userService.getUserCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load courses. Please try again later.');
        console.error(err);
      },
    });
  }


}

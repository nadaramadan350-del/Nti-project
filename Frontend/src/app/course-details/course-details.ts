import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseInterface } from '../interfaces/course-interface';
import { CoursesService } from '../services/courses-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  imports: [],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails implements OnInit {
  course = signal<CourseInterface | undefined>(undefined);
  courseId = signal('');

  courseService = inject(CoursesService);

  activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId.set(params['id']);
    });
  }

  ngOnInit(): void {
    this.courseService.getCourseById(this.courseId()).subscribe({
      next: (course) => {
        this.course.set(course);
      },
    });
  }
}

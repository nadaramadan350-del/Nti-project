import { Component, inject, OnInit, signal } from '@angular/core';
import { CoursesService } from '../services/courses-service';
import { CourseInterface } from '../interfaces/course-interface';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-course-management',
  styleUrl: './course-management.css',
  templateUrl: './course-management.html',
})
export class CourseManagement implements OnInit {
  courseService = inject(CoursesService);

  courses = signal<CourseInterface[]>([]);

  errorMessage = signal('');

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        console.log(data);
        this.courses.set(data);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load courses');
        console.log(err);
      },
    });
  }

  router = inject(Router);

  onAddCourse() {
    this.router.navigateByUrl('/admin-dashboard/add-course');
  }

  onShow(course: CourseInterface) {
    this.router.navigate(['/course-details', course._id]);
  }

  onUpdate(course: CourseInterface) {
    this.router.navigate(['/admin-dashboard/add-course'], {
      queryParams: { edit: course._id },
    });
  }

  onDelete(courseId: string) {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.courses.update((courses) => courses.filter((c) => c._id !== courseId));
      },
      error: (err) => {
        this.errorMessage.set('Failed to delete course');
        console.log(err);
      },
    });
  }
}

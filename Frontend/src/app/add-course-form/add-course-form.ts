import { Component, inject, OnInit, signal } from '@angular/core';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../constants/course-constants';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [TitleCasePipe, ReactiveFormsModule],
  selector: 'app-add-course-form',
  styleUrl: './add-course-form.css',
  templateUrl: './add-course-form.html',
})
export class AddCourseForm implements OnInit {
  categories = COURSE_CATEGORIES;
  levels = COURSE_LEVELS;

  courseService = inject(CoursesService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  errorMessage = signal('');
  selectedFile: File | null = null;
  editMode = false;
  courseId: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  addCourseForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    instructor: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    duration: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    students: new FormControl(0, [Validators.min(0)]),
    imageUrl: new FormControl(null),
    description: new FormControl('', [Validators.maxLength(1000)]),
  });

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const courseId = params.get('edit');
      if (courseId) {
        this.editMode = true;
        this.courseId = courseId;
        this.loadCourse(courseId);
      }
    });
  }

  loadCourse(courseId: string) {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.addCourseForm.patchValue({
          title: course.title,
          instructor: course.instructor,
          category: course.category,
          level: course.level,
          price: course.price,
          duration: course.duration,
          rating: course.rating ?? 0,
          students: course.students ?? 0,
          description: course.description ?? '',
        });
      },
      error: () => {
        this.errorMessage.set('Failed to load course for edit.');
      },
    });
  }

  onSubmit() {
    this.errorMessage.set('');
    if (this.addCourseForm.invalid) {
      this.addCourseForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValues = this.addCourseForm.value;

    Object.keys(formValues).forEach((key) => {
      const value = (formValues as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('imageUrl', this.selectedFile);
    }

    const request$ = this.editMode && this.courseId
      ? this.courseService.updateCourse(formData, this.courseId)
      : this.courseService.addCourse(formData);

    request$.subscribe({
      next: () => {
        this.addCourseForm.reset();
        this.selectedFile = null;
        this.router.navigateByUrl('/admin-dashboard');
      },
      error: () => {
        this.errorMessage.set(this.editMode ? 'Failed to update course' : 'Failed to add course');
      },
    });
  }
}

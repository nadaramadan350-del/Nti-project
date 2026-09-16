import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CourseInterface } from '../interfaces/course-interface';

@Service()
export class CoursesService {
  private baseUrl = 'http://localhost:5000/api/v1/courses';

  private httpClient = inject(HttpClient);

  getAllCourses(): Observable<CourseInterface[]> {
    return this.httpClient.get<any>(this.baseUrl).pipe(map((res) => res.data.courses));
  }

  getCourseById(courseId: string): Observable<CourseInterface> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/${courseId}`)
      .pipe(map((res) => res.data.course));
  }

  addCourse(course: FormData): Observable<CourseInterface> {
    return this.httpClient.post<any>(this.baseUrl, course).pipe(map((res) => res.data.course));
  }

  updateCourse(course: CourseInterface, courseId: string): Observable<CourseInterface> {
    return this.httpClient
      .patch<any>(`${this.baseUrl}/${courseId}`, course)
      .pipe(map((res) => res.data.course));
  }


  deleteCourse(courseId: string): Observable<CourseInterface> {
    return this.httpClient
      .delete<any>(`${this.baseUrl}/${courseId}`)
      .pipe(map((res) => res.data.course));
  }
}

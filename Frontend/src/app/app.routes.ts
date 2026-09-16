import { Routes } from '@angular/router';
import { SigninForm } from './signin-form/signin-form';
import { SignupForm } from './signup-form/signup-form';
import { CoursesList } from './courses-list/courses-list';
import { CourseDetails } from './course-details/course-details';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { CourseManagement } from './course-management/course-management';
import { AddCourseForm } from './add-course-form/add-course-form';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { StudentCourses } from './student-courses/student-courses';
import { adminGuard } from './guards/admin-guard';
import { studentGuard } from './guards/student-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: CoursesList, title: 'Home' },
  { path: 'signin', component: SigninForm, title: 'SignIn' },
  { path: 'signup', component: SignupForm, title: 'SignUp' },
  {
    path: 'course-details/:id',
    component: CourseDetails,
    title: 'Course Details',
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard],

    children: [
      {
        path: '',
        component: CourseManagement,
      },

      {
        path: 'add-course',
        component: AddCourseForm,
      },
    ],
  },

  {
    path: 'student-dashboard',
    component: StudentDashboard,
    title: 'Student Dashboard',
    canActivate: [studentGuard],
    children: [{ path: '', component: StudentCourses, title: 'Student Courses' }],
  },
];

import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { AuthService } from '../services/auth-service';

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-signup-form',
  styleUrl: './signup-form.css',
  templateUrl: './signup-form.html',
})
export class SignupForm {
  errorMessage = signal('');

  fileSelected: File | null = null;
  @ViewChild('fileInput') fileInput !: ElementRef<HTMLInputElement>;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileSelected = input.files[0];
    }
  }

  authService = inject(AuthService);

  signupModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    imageUrl: null,
  });

  signupForm = form(
    this.signupModel,
    (schema) => {
      (required(schema.firstName, { message: 'First name is required' }),
        minLength(schema.firstName, 2, { message: 'First name minimum length is 2 characters' }),
        maxLength(schema.firstName, 50, { message: 'First name length  is 50 characters' }),
        required(schema.lastName, { message: 'Last name is required' }),
        minLength(schema.lastName, 2, { message: 'Last name minimum length is 2 characters' }),
        maxLength(schema.lastName, 50, { message: 'Last name length  is 50 characters' }),
        required(schema.email, { message: 'Email is required' }),
        pattern(schema.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid Email' }),
        required(schema.password, { message: 'Password is required' }),
        minLength(schema.password, 8, { message: 'Password must be at least 8 characters' }),
        pattern(schema.phone, /^\+?[0-9]{10,15}$/, { message: 'Invalid Phone number' }));
    },

    {
      submission: {
        action: async (field) => {
          this.errorMessage.set('')
          console.log(field().value());

          const formValue = field().value();

          const formData = new FormData();

          formData.append('firstName', formValue.firstName);
          formData.append('lastName', formValue.lastName);
          formData.append('email', formValue.email);
          formData.append('password', formValue.password);
          formData.append('phone', formValue.phone);

          if (this.fileSelected) {
            formData.append('imageUrl', this.fileSelected);
          }

          this.authService.signup(formData).subscribe({
            next: (res) => {
              console.log(res);
              this.signupModel.set({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                imageUrl: null,
              });
              this.fileSelected = null;

              if(this.fileInput && this.fileInput.nativeElement){
                this.fileInput.nativeElement.value = '';
              }

              field().reset();
            },
            error: (err)=>{
              console.log(err);
              this.errorMessage.set('Failed to create account, Please try again later');
            }
          });
        },
      },
    },
  );
}

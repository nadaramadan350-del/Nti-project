import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCourseForm } from './add-course-form';

describe('AddCourseForm', () => {
  let component: AddCourseForm;
  let fixture: ComponentFixture<AddCourseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCourseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

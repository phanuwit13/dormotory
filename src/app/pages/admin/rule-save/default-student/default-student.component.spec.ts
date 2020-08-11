import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultStudentComponent } from './default-student.component';

describe('DefaultStudentComponent', () => {
  let component: DefaultStudentComponent;
  let fixture: ComponentFixture<DefaultStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

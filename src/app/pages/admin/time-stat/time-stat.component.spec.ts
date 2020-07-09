import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeStatComponent } from './time-stat.component';

describe('TimeStatComponent', () => {
  let component: TimeStatComponent;
  let fixture: ComponentFixture<TimeStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

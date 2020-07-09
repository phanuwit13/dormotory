import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeManageComponent } from './time-manage.component';

describe('TimeManageComponent', () => {
  let component: TimeManageComponent;
  let fixture: ComponentFixture<TimeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

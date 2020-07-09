import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleStatComponent } from './rule-stat.component';

describe('RuleStatComponent', () => {
  let component: RuleStatComponent;
  let fixture: ComponentFixture<RuleStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

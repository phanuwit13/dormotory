import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSaveComponent } from './rule-save.component';

describe('RuleSaveComponent', () => {
  let component: RuleSaveComponent;
  let fixture: ComponentFixture<RuleSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

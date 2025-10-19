import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGroupsTabComponent } from './evaluation-groups-tab.component';

describe('EvaluationGroupsTabComponent', () => {
  let component: EvaluationGroupsTabComponent;
  let fixture: ComponentFixture<EvaluationGroupsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationGroupsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationGroupsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

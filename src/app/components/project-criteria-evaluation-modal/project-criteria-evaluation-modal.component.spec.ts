import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCriteriaEvaluationModalComponent } from './project-criteria-evaluation-modal.component';

describe('ProjectCriteriaEvaluationModalComponent', () => {
  let component: ProjectCriteriaEvaluationModalComponent;
  let fixture: ComponentFixture<ProjectCriteriaEvaluationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCriteriaEvaluationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCriteriaEvaluationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

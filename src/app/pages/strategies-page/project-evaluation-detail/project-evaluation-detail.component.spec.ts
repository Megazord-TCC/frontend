import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEvaluationDetailComponent } from './project-evaluation-detail.component';

describe('ProjectEvaluationDetailComponent', () => {
  let component: ProjectEvaluationDetailComponent;
  let fixture: ComponentFixture<ProjectEvaluationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEvaluationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEvaluationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

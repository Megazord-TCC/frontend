import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationProjectCreateModalComponent } from './evaluation-project-create-modal.component';

describe('EvaluationProjectCreateModalComponent', () => {
  let component: EvaluationProjectCreateModalComponent;
  let fixture: ComponentFixture<EvaluationProjectCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationProjectCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationProjectCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationGroupEditModalComponent } from './evaluation-group-edit-modal.component';

describe('EvaluationGroupEditModalComponent', () => {
  let component: EvaluationGroupEditModalComponent;
  let fixture: ComponentFixture<EvaluationGroupEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationGroupEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationGroupEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

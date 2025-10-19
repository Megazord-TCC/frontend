import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalComponentComponent } from './form-modal-component.component';

describe('FormModalComponentComponent', () => {
  let component: FormModalComponentComponent;
  let fixture: ComponentFixture<FormModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

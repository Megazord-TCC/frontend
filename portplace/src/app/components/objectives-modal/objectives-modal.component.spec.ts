import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesModalComponent } from './objectives-modal.component';

describe('ObjectivesModalComponent', () => {
  let component: ObjectivesModalComponent;
  let fixture: ComponentFixture<ObjectivesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectivesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectivesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

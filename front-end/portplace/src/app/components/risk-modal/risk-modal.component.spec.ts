import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskModalComponent } from './risk-modal.component';

describe('RiskModalComponent', () => {
  let component: RiskModalComponent;
  let fixture: ComponentFixture<RiskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPortfolioModalComponent } from './edit-portfolio-modal.component';

describe('EditPortfolioModalComponent', () => {
  let component: EditPortfolioModalComponent;
  let fixture: ComponentFixture<EditPortfolioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPortfolioModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPortfolioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

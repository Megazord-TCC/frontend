import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfoliodetailComponent } from './portfoliodetail.component';

describe('PortfoliodetailComponent', () => {
  let component: PortfoliodetailComponent;
  let fixture: ComponentFixture<PortfoliodetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfoliodetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfoliodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailPageComponent } from './strategy-detail-page.component';

describe('StrategyDetailPageComponent', () => {
  let component: StrategyDetailPageComponent;
  let fixture: ComponentFixture<StrategyDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

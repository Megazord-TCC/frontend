import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategiesPageComponent } from './strategies-page.component';

describe('StrategiesPageComponent', () => {
  let component: StrategiesPageComponent;
  let fixture: ComponentFixture<StrategiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategiesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolGraphicComponent } from './pool-graphic.component';

describe('PoolGraphicComponent', () => {
  let component: PoolGraphicComponent;
  let fixture: ComponentFixture<PoolGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

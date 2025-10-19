import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCriteriosComponent } from './grupo-criterios.component';

describe('GrupoCriteriosComponent', () => {
  let component: GrupoCriteriosComponent;
  let fixture: ComponentFixture<GrupoCriteriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoCriteriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoCriteriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

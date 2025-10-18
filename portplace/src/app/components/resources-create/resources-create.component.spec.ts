import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisckResourcesCreateComponent } from './resources-create.component';

describe('RisckResourcesCreateComponent', () => {
  let component: RisckResourcesCreateComponent;
  let fixture: ComponentFixture<RisckResourcesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RisckResourcesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisckResourcesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

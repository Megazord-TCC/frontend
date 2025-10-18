import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPositionDetailComponent } from './resources-position-detail.component';

describe('ResourcesPositionDetailComponent', () => {
  let component: ResourcesPositionDetailComponent;
  let fixture: ComponentFixture<ResourcesPositionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPositionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesPositionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

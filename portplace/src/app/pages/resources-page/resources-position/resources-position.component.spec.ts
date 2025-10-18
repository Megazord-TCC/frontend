import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPositionComponent } from './resources-position.component';

describe('ResourcesPositionComponent', () => {
  let component: ResourcesPositionComponent;
  let fixture: ComponentFixture<ResourcesPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

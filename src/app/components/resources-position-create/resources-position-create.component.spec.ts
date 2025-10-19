import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPositionCreateComponent } from './resources-position-create.component';

describe('ResourcesPositionCreateComponent', () => {
  let component: ResourcesPositionCreateComponent;
  let fixture: ComponentFixture<ResourcesPositionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPositionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesPositionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

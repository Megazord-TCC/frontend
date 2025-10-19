import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesAllocationRequestComponent } from './resources-allocation-request.component';

describe('ResourcesAllocationRequestComponent', () => {
  let component: ResourcesAllocationRequestComponent;
  let fixture: ComponentFixture<ResourcesAllocationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesAllocationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesAllocationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

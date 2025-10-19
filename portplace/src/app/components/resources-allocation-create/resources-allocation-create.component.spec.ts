import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesAllocationCreateComponent } from './resources-allocation-create.component';

describe('ResourcesAllocationCreateComponent', () => {
  let component: ResourcesAllocationCreateComponent;
  let fixture: ComponentFixture<ResourcesAllocationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesAllocationCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesAllocationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

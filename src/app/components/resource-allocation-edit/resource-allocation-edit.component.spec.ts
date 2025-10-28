import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAllocationEditComponent } from './resource-allocation-edit.component';

describe('ResourceAllocationEditComponent', () => {
  let component: ResourceAllocationEditComponent;
  let fixture: ComponentFixture<ResourceAllocationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceAllocationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceAllocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPoolComponent } from './resources-pool.component';

describe('ResourcesPoolComponent', () => {
  let component: ResourcesPoolComponent;
  let fixture: ComponentFixture<ResourcesPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesPoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

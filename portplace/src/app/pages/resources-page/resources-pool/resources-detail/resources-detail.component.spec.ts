import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesDetailComponent } from './resources-detail.component';

describe('ResourcesDetailComponent', () => {
  let component: ResourcesDetailComponent;
  let fixture: ComponentFixture<ResourcesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

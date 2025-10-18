import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesRequestComponent } from './resources-request.component';

describe('ResourcesRequestComponent', () => {
  let component: ResourcesRequestComponent;
  let fixture: ComponentFixture<ResourcesRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

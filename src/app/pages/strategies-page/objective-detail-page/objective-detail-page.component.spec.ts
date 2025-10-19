import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveDetailPageComponent } from './objective-detail-page.component';

describe('ObjectiveDetailPageComponent', () => {
  let component: ObjectiveDetailPageComponent;
  let fixture: ComponentFixture<ObjectiveDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

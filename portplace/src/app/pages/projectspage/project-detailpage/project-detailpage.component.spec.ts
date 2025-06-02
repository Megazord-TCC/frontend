import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailpageComponent } from './project-detailpage.component';

describe('ProjectDetailpageComponent', () => {
  let component: ProjectDetailpageComponent;
  let fixture: ComponentFixture<ProjectDetailpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

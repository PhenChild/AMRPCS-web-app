import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExtremaComponent } from './form-extrema.component';

describe('FormExtremaComponent', () => {
  let component: FormExtremaComponent;
  let fixture: ComponentFixture<FormExtremaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExtremaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExtremaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtremaComponent } from './extrema.component';

describe('ExtremaComponent', () => {
  let component: ExtremaComponent;
  let fixture: ComponentFixture<ExtremaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtremaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtremaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

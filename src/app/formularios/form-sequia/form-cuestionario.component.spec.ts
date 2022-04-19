import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCuestionarioComponent } from './form-cuestionario.component';

describe('FormCuestionarioComponent', () => {
  let component: FormCuestionarioComponent;
  let fixture: ComponentFixture<FormCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCuestionarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

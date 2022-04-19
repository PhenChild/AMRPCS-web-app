import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAcumuladoComponent } from './form-acumulado.component';

describe('FormAcumuladoComponent', () => {
  let component: FormAcumuladoComponent;
  let fixture: ComponentFixture<FormAcumuladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAcumuladoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAcumuladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

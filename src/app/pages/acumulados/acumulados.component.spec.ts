import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladosComponent } from './acumulados.component';

describe('AcumuladosComponent', () => {
  let component: AcumuladosComponent;
  let fixture: ComponentFixture<AcumuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcumuladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcumuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

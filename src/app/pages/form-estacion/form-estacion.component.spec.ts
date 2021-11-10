import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormEstacionComponent } from "./form-estacion.component";

describe("FormEstacionComponent", () => {
    let component: FormEstacionComponent;
    let fixture: ComponentFixture<FormEstacionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({

            declarations: [ FormEstacionComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormEstacionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

});

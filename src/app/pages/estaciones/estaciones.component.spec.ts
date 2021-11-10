import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EstacionesComponent } from "./estaciones.component";

describe("EstacionesComponent", () => {
    let component: EstacionesComponent;
    let fixture: ComponentFixture<EstacionesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EstacionesComponent ],
            imports: [
                HttpClientTestingModule
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EstacionesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

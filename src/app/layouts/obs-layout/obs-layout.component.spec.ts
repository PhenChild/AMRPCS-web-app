import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTablesModule } from "angular-datatables";
import { ObsLayoutComponent } from "./obs-layout.component";


describe("ObsLayoutComponent", () => {
    let component: ObsLayoutComponent;
    let fixture: ComponentFixture<ObsLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ObsLayoutComponent, DataTablesModule],
            imports: [
                HttpClientTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObsLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

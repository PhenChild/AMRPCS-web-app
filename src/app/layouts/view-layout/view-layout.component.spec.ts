import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTablesModule } from "angular-datatables";
import { ViewLayoutComponent } from "./view-layout.component";


describe("ViewLayoutComponent", () => {
    let component: ViewLayoutComponent;
    let fixture: ComponentFixture<ViewLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ViewLayoutComponent, DataTablesModule ],
            imports: [
                HttpClientTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

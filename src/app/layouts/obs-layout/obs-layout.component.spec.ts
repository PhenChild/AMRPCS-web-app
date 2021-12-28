import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTablesModule } from "angular-datatables";
import { AdminLayoutComponent } from "./admin-layout.component";

describe("AdminLayoutComponent", () => {
    let component: AdminLayoutComponent;
    let fixture: ComponentFixture<AdminLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AdminLayoutComponent, DataTablesModule ],
            imports: [
                HttpClientTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

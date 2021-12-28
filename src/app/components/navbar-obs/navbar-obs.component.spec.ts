import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule} from "@angular/common/http/testing";
import { NavbarObsComponent } from "./navbar-obs.component";

describe("NavbarObsComponent", () => {
    let component: NavbarObsComponent;
    let fixture: ComponentFixture<NavbarObsComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [ NavbarObsComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarObsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("Carga nombre de la pagina", () => {
        expect(component.getTitle()).toBeInstanceOf(String);
    });

});

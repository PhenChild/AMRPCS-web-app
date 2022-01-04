import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule} from "@angular/common/http/testing";
import { NavbarViewComponent } from "./navbar-view.component";

describe("NavbarViewComponent", () => {
    let component: NavbarViewComponent;
    let fixture: ComponentFixture<NavbarViewComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [ NavbarViewComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarViewComponent);
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

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastrModule } from "ngx-toastr";
import { Usuario } from "src/app/modelos/usuario";

import { UsuariosComponent } from "./usuarios.component";

describe("UsuariosComponent", () => {
    let component: UsuariosComponent;
    let fixture: ComponentFixture<UsuariosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ToastrModule.forRoot() ],
            declarations: [ UsuariosComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UsuariosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /* it("Carga la pagina para editar un usuario", () => {
        component.editarUsuario(new Usuario);
        const table = (<HTMLInputElement>document.getElementById("table"));
        expect(table.style.display).toEqual("none");
    }); */
});

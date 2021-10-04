import { Component, Injectable, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/user";
import { NgForm } from "@angular/forms";
//import { DbService } from "../../services/database/db.service";

/**
 * Componente para el from de usuarios.
 */
@Component({
    selector: "app-form-usuario",
    templateUrl: "./form-usuario.component.html",
    styleUrls: ["./form-usuario.component.css"],
    encapsulation: ViewEncapsulation.None
})
@Injectable({
    providedIn: "root"
})
export class FormUsuarioComponent implements OnInit {


    /** Usuario */
    usuario = new User();

    /**
     * Constructor
     * @param dbService
     * @param tService
     */
    constructor(
        //private dbService: DbService,
        private tService: ToastrService
    ) { }

    /**
     * Inicialización
     */
    ngOnInit(): void {}

    /**
     * Envio de Registro de usuario
     * @param formUsuario
     */
    onSubmit(formUsuario: NgForm ) {
        console.log(this.usuario);
        /*this.dbService.addUsuario(this.usuario)
            .subscribe(
                data => {
                    this.tService.success("Usuario registrado con exito.", "Envio exitoso");
                    formUsuario.reset();
                },
                err => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                    formUsuario.reset();
                }
            );*/
    }
}

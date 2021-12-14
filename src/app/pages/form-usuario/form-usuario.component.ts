import { Component, Injectable, OnInit } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/user";
import { NgForm } from "@angular/forms";
import { DbService } from "../../services/database/db.service";
import { Estacion } from "src/app/models/estacion";
import { Subject } from "rxjs";

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

    /**
     * Opciones de los datatables.
     */
     dtOptions: DataTables.Settings = {};

 
     /**
      * Lista de estaciones
      */
     estaciones: Estacion[] = [];
 
     /**
      * Estacion selecionada.
      */
     selectedEstacion = new Estacion();
 
     /**
      * Operador de la tabla de estaciones.
      */
     dtTrigger1: Subject<any> = new Subject();
 

    /** Usuario */
    usuario = new User();

    /**
     * Constructor
     * @param dbService
     * @param tService
     */
    constructor(
        private dbService: DbService,
        private tService: ToastrService
    ) { }

    /**
     * Inicialización
     */
    ngOnInit(): void {
        const select = document.getElementById("rol");

        select!.addEventListener("change", function () {
            const val = (<HTMLInputElement>document.getElementById("rol")).value;
            const checkbox = (<HTMLInputElement>document.getElementById("checkboxEsPrincipal"));
            const table = (<HTMLInputElement>document.getElementById("table-container"));
            const estacion = (<HTMLInputElement>document.getElementById("text-estacion"));
            if (val.localeCompare("observer") === 0) {
                table.style.display = "block";
                checkbox.style.display = "block";
            } else if (val.localeCompare("admin") === 0) {
                table.style.display = "none";
                checkbox.style.display = "none";
                estacion.style.display = "none";
            }
        });

        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 4
        };

        this.dbService.getEstaciones()
            .subscribe((data: any) => {
                this.estaciones = (data as any);
                this.dtTrigger1.next();
            });
    }

    /**
     * Selecciona una estación a la que pertenecer el nuevo observador.
     * @param estacion Estacion escojida.
     */
     selectEstacion(estacion: Estacion): void {
        const table = (<HTMLInputElement>document.getElementById("table-container"));
        table.style.display = "none";
        this.selectedEstacion = estacion;
        const input = (<HTMLInputElement>document.getElementById("text-estacion"));
        input.style.display = "block";
    }

    /**
     * Deselecciona una estacion, para seleccionar otra para el observador.
     */
    unselectEstacion(): void {
        this.selectedEstacion = new Estacion();
        const table = (<HTMLInputElement>document.getElementById("table-container"));
        table.style.display = "block";
        const input = (<HTMLInputElement>document.getElementById("text-estacion"));
        input.style.display = "none";
    }

    /**
     * Envio de Registro de usuario
     * @param formUsuario
     */
    onSubmit(formUsuario: NgForm ) {
        console.log(this.usuario);
        this.dbService.addUsuario(this.usuario)
            .subscribe(
                (data: any) => {
                    this.tService.success("Usuario registrado con exito.", "Envio exitoso");
                    formUsuario.reset();
                },
                (err: any) => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                    formUsuario.reset();
                }
            );
    }
}

import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm} from "@angular/forms";
import { Estacion } from "../../models/estacion";
import { Injectable } from "@angular/core";
//import {DbService} from "../../services/database/db.service";
import { ToastrService } from "ngx-toastr";

/**
 * Componente para el from de usuarios.
 */
@Component({
    selector: "app-form-estacion",
    templateUrl: "./form-estacion.component.html",
    styleUrls: ["./form-estacion.component.css"]
})

/**
 * root
 */
@Injectable({
    providedIn: "root"
})

export class FormEstacionComponent implements OnInit {

    /** estación seleccionada */
    estacion = new Estacion();

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
    ngOnInit(): void {
    }

    /**
     * Guardado con exito de la estación
     * @param formEstacion
     */
    onSubmit(formEstacion: NgForm): void {
        /*this.dbService.addEstacion(this.estacion).subscribe(
            data => {
                this.tService.success("Estacion guardada con exito.", "Envio exitoso");
                formEstacion.reset();
            },
            err => {
                this.tService.error("", "Ha ocurrido un error");
                console.log(err);
                formEstacion.reset();
            }
        );*/
    }



}

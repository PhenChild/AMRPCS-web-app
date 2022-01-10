import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Estacion } from "../../models/estacion";
import { Injectable } from "@angular/core";
import { DbService } from "../../services/database/db.service";
import { ToastrService } from "ngx-toastr";
import { Pais } from "src/app/models/pais";
import { Division } from "src/app/models/division";

/**
 * Componente para el from de usuarios.
 */
@Component({
    selector: "app-form-estacion",
    templateUrl: "./form-estacion.component.html",
    styleUrls: ["./form-estacion.component.scss"]
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

    pais = "";
    division1 = "";
    division2 = "";
    division3 = "";

    paises: Pais[] = [];
    divisiones1: Division[] = [];
    divisiones2: Division[] = [];
    divisiones3: Division[] = [];

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

        this.dbService.getPaises()
            .subscribe((data: any) => {
                this.paises = (data as any);
            });
    }

    /**
     * Guardado con exito de la estación
     * @param formEstacion
     */
    onSubmit(formEstacion: NgForm): void {
        if (formEstacion.valid) {
            if (confirm("¿Está seguro de crear una nueva estación?")) {
                this.estacion.idUbicacion = this.division3;
                this.dbService.addEstacion(this.estacion).subscribe(
                    (data: any) => {
                        this.tService.success("Estacion guardada con exito.", "Envio exitoso");
                        formEstacion.reset();
                    },
                    (err: any) => {
                        this.tService.error("", "Ha ocurrido un error");
                        formEstacion.reset();
                    }
                );
            }
        }
    }

    getDivisiones(pais: any) {
        this.dbService.getDivisionesPaises(pais)
            .subscribe((data: any) => {
                this.divisiones1 = (data as any);
            });
    }

    getDivDivisiones(division: any, nivel: number) {
        if (nivel == 1) {
            this.dbService.getDivDivisiones(division, nivel)
                .subscribe((data: any) => {
                    this.divisiones2 = (data as any);
                });
        } else if (nivel == 2) {
            this.dbService.getDivDivisiones(division, nivel)
                .subscribe((data: any) => {
                    this.divisiones3 = (data as any);
                });
        }
    }

    cancelar(formEstacion: NgForm): void {
        this.estacion = new Estacion();
        formEstacion.reset();
    }
}

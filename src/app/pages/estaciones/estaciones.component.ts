import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { Estacion } from "../../models/estacion";
import { DbService } from "../../services/database/db.service";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observador } from "../../models/observador";

/**
 * Componente para la pagina de edición de estaciones.
 */
@Component({
    selector: "app-estaciones",
    templateUrl: "./estaciones.component.html",
    styleUrls: ["./estaciones.component.css"],
})
export class EstacionesComponent implements OnInit, OnDestroy {
    /** Opciones para los datatbles. */
    dtOptions: DataTables.Settings = {};

    /** Lista de estaciones */
    estaciones: Estacion[] = [];
    /** Lista de usuarios observadores */

    /** Usuario observador */
    usuarios: Observador[] = [];

    /** estación */
    estacion = new Estacion();

    /** Usuario seleccionado */
    selectedUser = new Observador();

    /** Operador del datatable de las estaciones */
    dtTrigger1: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private dbService: DbService,
        private tService: ToastrService
    ) { }

    /**
     * Obtencion de las estaciónes desde la base de datos
     */
    ngOnInit(): void {
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 7
        };
        this.dbService.getEstaciones()
            .subscribe((data: any) => {
                this.estaciones = (data as any);
                console.log(this.estaciones);
                this.dtTrigger1.next();
            });
    }

    /**
     * Elimina los operadores de los datatables
     */
    ngOnDestroy(): void {
        this.dtTrigger1.unsubscribe();
    }

    /**
     * Editar una estación
     * @param estacion estacion a editar
     */
    editarEstacion(estacion: any): void {
        this.estacion = estacion;
        this.estacion.latitud = estacion.posicion.coordinates[0];
        this.estacion.longitud = estacion.posicion.coordinates[1];
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-estacion"));
        table.style.display = "none";
        form.style.display = "block";
    }

    /**
     * Eliminar una estación
     * @param estacion estación que será eliminada
     */
    deleteEstacion(estacion: any): void {
        this.estacion = estacion;
        this.dbService.deleteEstacion(this.estacion).subscribe((data: any) => {
            this.tService.success("Estacion eliminada con exito.", "Envio exitoso");
            window.location.reload();
        },
            (err: any) => {
                console.log(err);
                this.tService.error("", "Ha ocurrido un error");
            });
    }


    /**
     * Envio de actualización de estación
     * @param formEstacion formulario de estación
     */
    submit(formEstacion: NgForm): void {
        this.dbService.updateEstacion(this.estacion)
            .subscribe(
                (data: any) => {
                    this.tService.success("Estacion actualizada con exito.", "Envio exitoso");
                    formEstacion.reset();
                    const table = (<HTMLInputElement>document.getElementById("table"));
                    const form = (<HTMLInputElement>document.getElementById("form-estacion"));
                    table.style.display = "block";
                    form.style.display = "none";
                    window.location.reload();
                },
                (err: any) => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                }
            );
    }

    /**
     * Cancelar la actualización
     * @param formEstacion formulario de actualización
     */
    cancelar(formEstacion: NgForm): void {
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-estacion"));
        table.style.display = "block";
        form.style.display = "none";
        this.estacion = new Estacion();
        formEstacion.reset();
    }
}

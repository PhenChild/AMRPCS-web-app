import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { Estacion } from "../../models/estacion";
//import {DbService} from "../../services/database/db.service";
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

    /** Operador del datatable de los observadores */
    dtTrigger2: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        //private dbService: DbService,
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
    /*this.dbService.getEstaciones()
            .subscribe(data => {
                this.estaciones = (data as any);
                console.log(this.estaciones);
                this.dtTrigger1.next();
            });*/
    }

    /**
     * Elimina los operadores de los datatables
     */
    ngOnDestroy(): void{
        this.dtTrigger1.unsubscribe();
        this.dtTrigger2.unsubscribe();
    }

    /**
     * Editar una estación
     * @param estacion estacion a editar
     */
    editarEstacion(estacion: any): void{
        this.estacion = estacion;
        this.estacion.latitud = estacion.posicion.coordinates[0];
        this.estacion.longitud = estacion.posicion.coordinates[1];
        /*this.dbService.getObservadores(this.estacion)
            .subscribe(data => {
                this.usuarios = (data as any);
                const table = (<HTMLInputElement>document.getElementById("table"));
                const form = (<HTMLInputElement>document.getElementById("form-estacion"));
                table.style.display = "none";
                form.style.display = "block";
                this.dtTrigger2.next();
            });*/
    }

    /**
     * Selección de un usuario
     * @param usuario usuario a seleccionar
     */
    selectUsuario(usuario: any): void {
        const table = (<HTMLInputElement>document.getElementById("table-container"));
        table.style.display = "none";
        this.selectedUser.id = usuario.id;
        this.selectedUser.nombre = usuario.User.nombre;
        this.selectedUser.apellido = usuario.User.apellido;
        this.selectedUser.email = usuario.User.email;
        const input = (<HTMLInputElement>document.getElementById("text-usuario"));
        input.style.display = "block";
    }

    /**
     * Dejar de selecionar un usuario
     */
    unselectUsuario(): void {
        this.selectedUser = new Observador();
        const table = (<HTMLInputElement>document.getElementById("table-container"));
        table.style.display = "block";
        const input = (<HTMLInputElement>document.getElementById("text-usuario"));
        input.style.display = "none";
    }

    /**
     * Eliminar una estación
     * @param estacion estación que será eliminada
     */
    deleteEstacion(estacion: any): void {
        this.estacion = estacion;
        /*this.dbService.deleteEstacion(this.estacion).subscribe(data => {
            this.tService.success("Estacion eliminada con exito.", "Envio exitoso");
            window.location.reload();
        },
        err => {
            console.log(err);
            this.tService.error("", "Ha ocurrido un error");
        });*/
    }


    /**
     * Envio de actualización de estación
     * @param formEstacion formulario de estación
     */
    submit(formEstacion: NgForm): void  {
        this.estacion.jefeId = this.selectedUser.id;
        /*this.dbService.updateEstacion(this.estacion)
            .subscribe(
                data => {
                    this.tService.success("Estacion actualizada con exito.", "Envio exitoso");
                    formEstacion.reset();
                    const table = (<HTMLInputElement>document.getElementById("table"));
                    const form = (<HTMLInputElement>document.getElementById("form-estacion"));
                    table.style.display = "block";
                    form.style.display = "none";
                    window.location.reload();
                },
                err => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                    formEstacion.reset();
                }
            );*/
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

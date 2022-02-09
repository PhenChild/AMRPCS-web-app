import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/user";
import { NgForm } from "@angular/forms";
import { DbService } from "../../services/database/db.service";
import { Estacion } from "src/app/models/estacion";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { Pais } from "src/app/models/pais";

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

    @ViewChild(DataTableDirective, { static: false })
    dtElement!: DataTableDirective;

    /** Opciones para los datatbles. */
    dtOptions: DataTables.Settings = {
        pagingType: "full_numbers",
        pageLength: 5,
        responsive: true,
        searching: false,
        lengthChange: false
    };
    /**
     * Lista de estaciones
     */
    estaciones: Estacion[] = [];

    paises: Pais[] = [];

    /**
     * Estacion selecionada.
     */
    selectedEstaciones: Estacion[] = [];

    /**
     * Operador de la tabla de estaciones.
     */
    dtTrigger1: Subject<any> = new Subject();


    filtro = {
        nombre: "",
        codigo: "",
        pais: ""
    }

    isDtInitialized: boolean = false

    /** Usuario */
    usuario = new User();
    confpassword = "";

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

    tableEstacion() {
        const table = (<HTMLInputElement>document.getElementById("form-estacion-new"));
        if (this.usuario.role == "observer") {
            table.style.display = "block";
        } else {
            table.style.display = "none";
        }
    }


    getData(): void {
        const table = (<HTMLInputElement>document.getElementById("tablaEstaciones"));
        table.style.display = "none";
        if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy()
            })
        } else {
            this.isDtInitialized = true;
        }

        this.dbService.getEstacionesParaUsuario(this.filtro)
            .subscribe((data: any) => {
                this.estaciones = (data as any);
                this.dtTrigger1.next();
                const table = (<HTMLInputElement>document.getElementById("tablaEstaciones"));
                table.style.display = "block";
            });
    }

    /**
     * Selecciona una estación a la que pertenecer el nuevo observador.
     * @param estacion Estacion escojida.
     */
    selectEstacion(estacion: Estacion): void {
        if (this.selectedEstaciones.filter(obj => obj.id == estacion.id).length <= 0) {
            this.selectedEstaciones.push(estacion);
        }
    }

    /**
     * Deselecciona una estacion, para seleccionar otra para el observador.
     */
    unselectEstacion(estacion: Estacion): void {
        this.selectedEstaciones = this.selectedEstaciones.filter(obj => obj !== estacion);
    }

    /**
     * Envío de Registro de usuario
     * @param formUsuario
     */
    onSubmit(formUsuario: NgForm) {
        if (formUsuario.valid) {
            if (this.confpassword == this.usuario.password) {
                if (this.usuario.role == "observer" && this.selectedEstaciones.length == 0) {
                    this.tService.error("", "Debe seleccionar al menos una estación para el observador.");
                } else {
                    if (confirm("¿Está seguro de crear un nuevo usuario?")) {
                        this.dbService.addUsuario(this.usuario, this.selectedEstaciones)
                            .subscribe(
                                (data: any) => {
                                    this.tService.success("Usuario registrado con éxito.", "Envío exitoso");
                                    formUsuario.reset();
                                    this.selectedEstaciones = [];
                                    this.estaciones = [];
                                    if (this.isDtInitialized) {
                                        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                                            dtInstance.destroy()
                                        })
                                    } else {
                                        this.isDtInitialized = true;
                                    }
                                    this.dtTrigger1.next();
                                },
                                (err: any) => {
                                    if (err.status == 418) {
                                        this.tService.error("", "El correo se encuentra en uso por otro usuario.");
                                    } else {
                                        this.tService.error("", "Ha ocurrido un error");
                                    }
                                }
                            );
                    }
                }
            } else {
                this.tService.error("", "Las contraseñas deben coincidir");
            }
        }
    }

    cancelar(formUsuario: NgForm) {
        const table = (<HTMLInputElement>document.getElementById("form-estacion-new"));
        table.style.display = "none"
        this.usuario = new User();
        formUsuario.reset()
    }
}

import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Estacion } from "../../models/estacion";
import { DbService } from "../../services/database/db.service";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observador } from "../../models/observador";
import { DataTableDirective } from "angular-datatables";
import { FileUploader } from "ng2-file-upload";
import { Location } from "@angular/common";
import { Pais } from "src/app/models/pais";
import { Division } from "src/app/models/division";

/**
 * Componente para la pagina de edición de estaciones.
 */
@Component({
    selector: "app-estaciones",
    templateUrl: "./estaciones.component.html",
    styleUrls: ["./estaciones.component.scss"],
})
export class EstacionesComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective, { static: false })
    dtElement!: DataTableDirective;

    /** Opciones para los datatbles. */
    dtOptions: DataTables.Settings = {
        pagingType: "full_numbers",
        pageLength: 7,
        responsive: true,
        searching: false,
        lengthChange: false,
    };

    /* Data for upload image */
    url!: string | ArrayBuffer | null;
    format!: string;

    uploader!: FileUploader;

    response!: string;

    isSuccess!: boolean;
    isCancel!: boolean;
    isError!: boolean;

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

    filtro = {
        nombre: "",
        codigo: "",
        pais: ""
    }


    pais = "";
    division1 = "";
    division2 = "";
    division3 = "";

    paises: Pais[] = [];
    divisiones1: Division[] = [];
    divisiones2: Division[] = [];
    divisiones3: Division[] = [];


    isDtInitialized: boolean = false
    public location!: Location;
    isAdmin = false;
    /**
     * Constructor
     */
    constructor(
        location: Location,
        private dbService: DbService,
        private tService: ToastrService
    ) {
        this.location = location;

        this.uploader = new FileUploader({
            url: dbService.dbURL + "estacion/updatePicture",
            method: "POST",
            itemAlias: "file",
            queueLimit: 1,
            headers: [{
                name: "x-access-token", value:
                    sessionStorage.getItem("token")!
            }]
        });

        this.response = '';

        this.uploader.response.subscribe(res => this.response = res);
    }

    /**
     * Obtencion de las estaciónes desde la base de datos
     */
    ngOnInit(): void {
        console.log(this.location.path())
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === "#") {
            titlee = titlee.slice(1);
        }
        titlee = titlee.split("/")[1]
        if (titlee === "admin-layout") {
            this.isAdmin = true;
        }

        this.isCancel = false;
        this.isError = false;
        this.isSuccess = false;



        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

        this.uploader.onBeforeUploadItem = (item: any) => {
            this.uploader.options.additionalParameter = {
                id: this.estacion.id
            };
        };

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            const table = (<HTMLInputElement>document.getElementById("table"));
            const form = (<HTMLInputElement>document.getElementById("form-update-foto"));
            table.style.display = "block";
            form.style.display = "none";
            this.tService.success("Foto actualizada con exito.", "Envio exitoso");
            this.uploader.clearQueue()
            console.log("ImageUpload:uploaded:", item, status, response);
        };
    }

    /**
     * Elimina los operadores de los datatables
     */
    ngOnDestroy(): void {
        this.dtTrigger1.unsubscribe();
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

        this.dbService.getEstaciones(this.filtro)
            .subscribe((data: any) => {
                this.estaciones = (data as any);
                console.log(this.estaciones);
                this.dtTrigger1.next();
                const table = (<HTMLInputElement>document.getElementById("tablaEstaciones"));
                table.style.display = "block";
            });
    }

    /**
     * Editar una estación
     * @param estacion estacion a editar
     */
    editarEstacion(estacion: any): void {
        console.log(estacion)
        this.dbService.getObservadores(estacion)
            .subscribe((data: any) => {
                this.usuarios = (data as any);
                this.dbService.getFotoEstacion(this.estacion)
                    .subscribe(
                        (data: any) => {
                            if (data.foto != undefined) {
                                this.estacion.foto = data.foto
                            }
                        }
                    );
            });
        this.dbService.getPaises()
            .subscribe((data: any) => {
                this.paises = (data as any);
                console.log(this.paises);
            });
        this.estacion = estacion;
        this.estacion.latitud = estacion.posicion.coordinates[0];
        this.estacion.longitud = estacion.posicion.coordinates[1];
        this.getDivisiones(estacion.Division.Pai.id)
        this.getDivDivisiones(estacion.division1.id, 1)
        this.getDivDivisiones(estacion.division2.id, 2)
        this.pais = estacion.Division.Pai.id;
        this.division1 = estacion.division1.id;
        this.division2 = estacion.division2.id;
        this.division3 = estacion.division3.id;
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
        if (confirm("¿Está seguro de eliminar esta estación?")) {
            this.dbService.deleteEstacion(this.estacion).subscribe((data: any) => {
                this.tService.success("Estacion eliminada con exito.", "Envio exitoso");
                window.location.reload();
            },
                (err: any) => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                });
        }
    }


    /**
     * Envio de actualización de estación
     * @param formEstacion formulario de estación
     */
    submit(formEstacion: NgForm): void {
        if (confirm("¿Está seguro de actualizar la información de esta estación?")) {

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

    editarFoto(estacion: Estacion): void {
        this.estacion = estacion;
        this.dbService.getFotoEstacion(this.estacion)
            .subscribe(
                (data: any) => {
                    this.estacion.foto = data.foto
                    const table = (<HTMLInputElement>document.getElementById("table"));
                    const form = (<HTMLInputElement>document.getElementById("form-update-foto"));
                    table.style.display = "none";
                    form.style.display = "block";
                },
                (err: any) => {
                    const table = (<HTMLInputElement>document.getElementById("table"));
                    const form = (<HTMLInputElement>document.getElementById("form-update-foto"));
                    table.style.display = "none";
                    form.style.display = "block";
                }
            );
    }

    cancelarFoto(): void {
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-update-foto"));
        table.style.display = "block";
        form.style.display = "none";
        this.estacion = new Estacion();
    }


    subirFoto() {
        if (this.uploader.queue.length != 0) {
            if (confirm("¿Está seguro de actualizar la foto de esta estación?")) {
                this.uploader.queue[0].upload()
            }
        } else {
            this.tService.error("", "Debe elegir un archivo para actualizar la foto.");
        }
    }

    getDivisiones(pais: any) {
        this.division1 = "";
        this.division2 = "";
        this.division3 = "";
        this.divisiones1 = [];
        this.divisiones2 = [];
        this.divisiones3 = [];
        console.log(pais)
        this.dbService.getDivisionesPaises(pais)
            .subscribe((data: any) => {
                this.divisiones1 = (data as any);
            });
    }

    getDivDivisiones(division: any, nivel: number) {
        if (nivel == 1) {
            this.division2 = "";
            this.division3 = "";
            this.divisiones2 = [];
            this.divisiones3 = [];
            this.dbService.getDivDivisiones(division, nivel)
                .subscribe((data: any) => {
                    this.divisiones2 = (data as any);
                });
        } else if (nivel == 2) {
            this.division3 = "";
            this.divisiones3 = [];
            this.dbService.getDivDivisiones(division, nivel)
                .subscribe((data: any) => {
                    this.divisiones3 = (data as any);
                });
        }
    }

}

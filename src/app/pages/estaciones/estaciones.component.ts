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
import { Variable } from "src/app/models/variable";
import { Router } from "@angular/router";
import Utils from "src/app/utils/utils";

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
    variables: Variable[] = [];
    filtroPaises: Pais[] = [];

    isDtInitialized: boolean = false
    public location!: Location;
    isAdmin = false;
    isObserver = false;
    isCharts = false;
    /**
     * Constructor
     */
    constructor(
        location: Location,
        private dbService: DbService,
        private tService: ToastrService,
        private router: Router,
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
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === "#") {
            titlee = titlee.slice(1);
        }
        titlee = titlee.split("/")[1]
        if (titlee === "admin-layout") {
            this.isAdmin = true;
        } if (titlee === "obs-layout") {
            this.isObserver = true;
        }

        this.isCancel = false;
        this.isError = false;
        this.isSuccess = false;



        this.dbService.getPaises()
            .subscribe((data: any) => {
                this.filtroPaises = (data as any);
            });

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
            this.tService.success("Foto actualizada con éxito.", "Envío exitoso");
            this.uploader.clearQueue()
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
            .subscribe((data: Estacion[]) => {
                this.estaciones = data;
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
        this.dbService.getTipoRegistros(estacion)
            .subscribe((data: any) => {
                this.variables = data;
                if (this.variables.length >= 1) this.isCharts = true;
            });
        this.estacion = estacion;
        this.estacion.latitud = estacion.posicion.coordinates[0];
        this.estacion.longitud = estacion.posicion.coordinates[1];
        if (this.isAdmin) {
            this.dbService.getPaises()
                .subscribe((data: any) => {
                    this.paises = (data as any);
                });
            this.getDivisiones(estacion.Division.Pai.id)
            this.getDivDivisiones(estacion.division1.id, 1)
            this.getDivDivisiones(estacion.division2.id, 2)
            this.pais = estacion.Division.Pai.id;
            this.division1 = estacion.division1.id;
            this.division2 = estacion.division2.id;
            this.division3 = estacion.division3.id;
        } else {
            this.pais = estacion.Division.Pai.nombre;
            this.division1 = estacion.division1.nombre;
            this.division2 = estacion.division2.nombre;
            this.division3 = estacion.division3.nombre;
        }
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
                this.tService.success("Estación eliminada con éxito.", "Envío exitoso");
                this.getData();
            },
                (err: any) => {
                    this.tService.error("", "Ha ocurrido un error");
                });
        }
    }


    /**
     * Envío de actualización de estación
     * @param formEstacion formulario de estación
     */
    submit(formEstacion: NgForm): void {
        if (formEstacion.valid) {
            if (this.divisiones3.filter(d => d.id.toString() == this.division3).length == 0) {
                this.tService.error("", "Por favor, seleccionar 3 niveles de divisiones políticas.");
            } else {
                if (confirm("¿Está seguro de actualizar la información de esta estación?")) {
                    this.estacion.idUbicacion = this.division3;
                    this.dbService.updateEstacion(this.estacion)
                        .subscribe(
                            (data: any) => {
                                this.tService.success("Estación actualizada con éxito.", "Envío exitoso");
                                formEstacion.reset();
                                const table = (<HTMLInputElement>document.getElementById("table"));
                                const form = (<HTMLInputElement>document.getElementById("form-estacion"));
                                table.style.display = "block";
                                form.style.display = "none";
                                this.getData();
                            },
                            (err: any) => {
                                this.tService.error("", "Ha ocurrido un error");
                            }
                        );
                }
            }
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
        this.isCharts = false;
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

    verGraficos() {
        let url = (this.isAdmin) ? "/admin-layout" : (this.isObserver) ? "/obs-layout" : "/view-layout"
        var dn = new Date(Date.now());
        var df = new Date(Date.now());
        df.setMonth(dn.getMonth() - 1)
        this.router.navigate([url + '/graficos', { estacion: this.estacion.nombre, ff: dn.toLocaleString(), fi: df.toLocaleString() }]);
    }

    verDatos(variable: any) {
        var dn = new Date(Date.now());
        var df = new Date(Date.now());
        df.setMonth(dn.getMonth() - 1)
        let url = (this.isAdmin) ? "/admin-layout" : (this.isObserver) ? "/obs-layout" : "/view-layout"
        if (variable.nombre == "Precipitación Diaria") {
            this.router.navigate([url + '/reportes', { estacion: this.estacion.nombre, ff: dn.toLocaleString(), fi: df.toLocaleString() }]);
        } else if (variable.nombre == "Precipitación Acumulada") {
            this.router.navigate([url + '/acumulados', { estacion: this.estacion.nombre, ff: dn.toLocaleString(), fi: df.toLocaleString() }]);
        }
    }

    time(fecha: any) {
        return Utils.time(fecha);
    }

    date(fecha: any) {
        return Utils.date(fecha);
    }

    activar(estacion: any) {
        if (confirm("¿Está seguro de activar esta estación?")) {
            this.dbService.activateEstacion(estacion).subscribe((data: any) => {
                this.tService.success("Estación activada con éxito.", "Envío exitoso");
                this.getData();
            }, (err: any) => {
                if (err.status == 418) {
                    this.tService.error("La estación pertenece a una ubicación inactiva.", "Error");
                } else {
                    this.tService.error("", "Ha ocurrido un error");
                }
            })
        }
    }
}

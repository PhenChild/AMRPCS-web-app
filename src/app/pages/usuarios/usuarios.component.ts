import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { ViewEncapsulation } from "@angular/core";
import { DbService } from "../../services/database/db.service";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/user";
import { DataTableDirective } from "angular-datatables";
import { Pais } from "src/app/models/pais";
import { FileUploader } from 'ng2-file-upload';
import { Estacion } from "src/app/models/estacion";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";


/**
 * Componente para la pagina de usuarios.
 */
@Component({
    selector: "app-usuarios",
    templateUrl: "./usuarios.component.html",
    styleUrls: ["./usuarios.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class UsuariosComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective, { static: false })
    dtElement!: DataTableDirective;

    /** Opciones para los datatbles. */
    dtOptions: DataTables.Settings = {
        pagingType: "full_numbers",
        pageLength: 7,
        responsive: true,
        searching: false,
    };;

    /* Data for upload image */
    url!: string | ArrayBuffer | null;
    format!: string;

    uploader!: FileUploader;

    response!: string;

    isSuccess!: boolean;
    isCancel!: boolean;
    isError!: boolean;


    /** Lista de usuarios*/
    usuarios: User[] = [];

    /** Usuario seleccionado */
    usuario = new User();
    paises: Pais[] = [];

    confpassword = "";

    /** Operador del datatable de los usuarios */
    dtTrigger: Subject<any> = new Subject<any>();
    dtTrigger1: Subject<any> = new Subject<any>();

    isDtInitialized: boolean = false;
    isDtInitialized2: boolean = false;
    filtro = {
        nombre: "",
        email: "",
        rol: "",
    };

    filtroEstacion = {
        nombre: "",
        codigo: "",
        pais: ""
    }



    estaciones: Estacion[] = [];

    selectedEstaciones: Estacion[] = [];
    addedEstaciones: Estacion[] = [];
    deletedEstaciones: Estacion[] = []

    /**
     * Constructor
     * @param dbService
     * @param tService
     */
    constructor(
        private dbService: DbService,
        private tService: ToastrService
    ) {


        this.uploader = new FileUploader({
            url: dbService.dbURL + "users/updatePicture",
            method: "POST",
            itemAlias: "file",
            queueLimit: 1,
        });

        this.response = '';

        this.uploader.response.subscribe(res => this.response = res);
    }


    /**
     * Obtencion de los usuarios desde la base de datos
     */
    ngOnInit(): void {
        this.isCancel = false;
        this.isError = false;
        this.isSuccess = false;



        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

        this.uploader.onBeforeUploadItem = (item: any) => {
            this.uploader.options.additionalParameter = {
                id: this.usuario.id
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
        this.dtTrigger.unsubscribe();
    }

    tableEstacion() {
        const table = (<HTMLInputElement>document.getElementById("form-estacion"));
        if (this.usuario.role == "observer") {
            table.style.display = "block";
        } else {
            table.style.display = "none";
        }
    }

    getData(): void {
        const table = (<HTMLInputElement>document.getElementById("tablaUsuarios"));
        table.style.display = "none";
        if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy()
            })
        } else {
            this.isDtInitialized = true;
        }
        this.dbService.getUsuarios(this.filtro)
            .subscribe((data: User[]) => {
                this.usuarios = data;
                console.log(this.usuarios);
                this.dtTrigger.next();
                const table = (<HTMLInputElement>document.getElementById("tablaUsuarios"));
                table.style.display = "block";
            }, (err: any) => {
                console.log(err);
            });
    }

    getDataEstaciones(): void {
        const table = (<HTMLInputElement>document.getElementById("tablaEstaciones"));
        table.style.display = "none";
        if (this.isDtInitialized2) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy()
            })
        } else {
            this.isDtInitialized2 = true;
        }

        this.dbService.getEstacionesParaUsuario(this.filtroEstacion)
            .subscribe((data: any) => {
                this.estaciones = (data as any);
                console.log(this.estaciones);
                this.dtTrigger1.next();
                const table = (<HTMLInputElement>document.getElementById("tablaEstaciones"));
                table.style.display = "block";
            });
    }

    /**
     * Edición de usuarios
     * @param usuario usuario con datos para la actualizacion del usuario
     */
    editarUsuario(usuario: any): void {
        this.dbService.getPaises()
            .subscribe((data: any) => {
                this.paises = (data as any);
            });
        this.dbService.getEstacionesUsuario(usuario)
            .subscribe((data: any[]) => {
                console.log(data)
                this.selectedEstaciones = data.map((a) => a.Estacion)
                console.log(this.selectedEstaciones);
            });
        this.usuario = usuario;
        this.usuario.password = "";
        const tableE = (<HTMLInputElement>document.getElementById("form-estacion"));
        if (usuario.role == "observer") {
            tableE.style.display = "block"
        } else {
            tableE.style.display = "none"
        }
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-usuario"));
        table.style.display = "none";
        form.style.display = "block";
    }

    editarPassword(usuario: any): void {
        this.usuario = usuario;
        this.usuario.password = "";
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-update-password"));
        table.style.display = "none";
        form.style.display = "block";
    }

    /**
     * Eliminación de usuarios
     * @param usuario usuario a eliminar
     */
    deleteUsuario(usuario: any): void {
        this.usuario = usuario;
        this.dbService.deleteUsuario(this.usuario).subscribe((data: any) => {
            this.tService.success("Estacion guardada con exito.", "Envio exitoso");
            window.location.reload();
        },
            (err: any) => {
                this.tService.error("", "Ha ocurrido un error");
            });
    }

    /**
     * Guardado de la actualización de un usuario
     * @param formUsuario formulario de usuario
     */
    submit(formUsuario: NgForm): void {
        this.dbService.updateUsuario(this.usuario, this.addedEstaciones, this.deletedEstaciones)
            .subscribe(
                (data: any) => {
                    const table = (<HTMLInputElement>document.getElementById("table"));
                    const form = (<HTMLInputElement>document.getElementById("form-usuario"));
                    table.style.display = "block";
                    form.style.display = "none";
                    this.usuario = new User();
                    this.tService.success("Usuario actualizado con exito.", "Envio exitoso");
                    formUsuario.reset();
                },
                (err: any) => {
                    console.log(err);
                    this.tService.error("", "Ha ocurrido un error");
                    this.addedEstaciones = [];
                    this.deletedEstaciones = [];
                    this.selectedEstaciones = [];
                    formUsuario.reset();
                }
            );
    }


    /**
     * Cancelar la actualización
     * @param formUser formulario de usuario
     */
    cancelar(formUser: NgForm): void {
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-usuario"));
        table.style.display = "block";
        form.style.display = "none";
        this.usuario = new User();
        formUser.reset();
    }

    submitPassword(formPasswordUsuario: NgForm): void {
        if (this.confpassword == this.usuario.password) {
            this.dbService.updateUserPassword(this.usuario)
                .subscribe(
                    (data: any) => {
                        const table = (<HTMLInputElement>document.getElementById("table"));
                        const form = (<HTMLInputElement>document.getElementById("form-update-password"));
                        table.style.display = "block";
                        form.style.display = "none";
                        this.tService.success("Contraseña actualizada con exito.", "Envio exitoso");
                        formPasswordUsuario.reset();
                    },
                    (err: any) => {
                        console.log(err);
                        this.tService.error("", "Ha ocurrido un error");
                        formPasswordUsuario.reset();
                    }
                );
        } else {
            this.tService.error("", "Las contraseñas deben coincidir");
        }
    }

    cancelarPassword(formPasswordUsuario: NgForm): void {
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-update-password"));
        table.style.display = "block";
        form.style.display = "none";
        this.usuario = new User();
        formPasswordUsuario.reset();
    }

    editarFoto(usuario: User): void {
        this.usuario = usuario;
        this.dbService.getFoto(this.usuario)
            .subscribe(
                (data: any) => {
                    this.usuario.foto = data.foto
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

    subirFoto() {
        if (this.uploader.queue.length != 0) {
            this.uploader.queue[0].upload()
        }
    }

    cancelarFoto(): void {
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-update-foto"));
        table.style.display = "block";
        form.style.display = "none";
        this.usuario = new User();
    }


    /**
     * Selecciona una estación a la que pertenecer el nuevo observador.
     * @param estacion Estacion escojida.
     */
    selectEstacion(estacion: Estacion): void {
        if (!this.selectedEstaciones.some(e => e.id == estacion.id) && !this.deletedEstaciones.some(e => e.id == estacion.id)) {
            this.selectedEstaciones.push(estacion);
            this.addedEstaciones.push(estacion);
            console.log(this.selectedEstaciones)
            console.log(this.addedEstaciones)
            console.log(this.deletedEstaciones)
        } else if (!this.selectedEstaciones.some(e => e.id == estacion.id) && this.deletedEstaciones.some(e => e.id == estacion.id)) {
            this.selectedEstaciones.push(estacion);
            this.deletedEstaciones = this.deletedEstaciones.filter(obj => obj !== estacion);
            console.log(this.selectedEstaciones)
            console.log(this.addedEstaciones)
            console.log(this.deletedEstaciones)

        }
    }

    /**
     * Deselecciona una estacion, para seleccionar otra para el observador.
     */
    unselectEstacion(estacion: Estacion): void {
        this.selectedEstaciones = this.selectedEstaciones.filter(obj => obj !== estacion);
        if (!this.deletedEstaciones.includes(estacion) && !this.addedEstaciones.includes(estacion)) {
            this.deletedEstaciones.push(estacion);
            console.log(this.selectedEstaciones)
            console.log(this.addedEstaciones)
            console.log(this.deletedEstaciones)
        } else if (!this.deletedEstaciones.includes(estacion) && this.addedEstaciones.includes(estacion)) {
            this.addedEstaciones = this.addedEstaciones.filter(obj => obj !== estacion);
            console.log(this.selectedEstaciones)
            console.log(this.addedEstaciones)
            console.log(this.deletedEstaciones)
        }
    }
}

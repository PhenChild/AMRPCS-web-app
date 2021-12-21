import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { ViewEncapsulation } from "@angular/core";
import { DbService } from "../../services/database/db.service";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/models/user";
import { DataTableDirective } from "angular-datatables";

/**
 * Componente para la pagina de usuarios.
 */
@Component({
    selector: "app-usuarios",
    templateUrl: "./usuarios.component.html",
    styleUrls: ["./usuarios.component.css"],
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

    /** Lista de usuarios*/
    usuarios: User[] = [];

    /** Usuario seleccionado */
    usuario = new User();

    /** Operador del datatable de los usuarios */
    dtTrigger: Subject<any> = new Subject<any>();

    isDtInitialized: boolean = false

    filtro = {
        nombre: "",
        email: "",
        rol: "",
    };

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
     * Obtencion de los usuarios desde la base de datos
     */
    ngOnInit(): void {
    }

    /**
     * Elimina los operadores de los datatables
     */
    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
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

    /**
     * Edición de usuarios
     * @param usuario usuario con datos para la actualizacion del usuario
     */
    editarUsuario(usuario: any): void {
        this.usuario = usuario;
        this.usuario.password = "";
        const table = (<HTMLInputElement>document.getElementById("table"));
        const form = (<HTMLInputElement>document.getElementById("form-usuario"));
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
        this.dbService.updateUsuario(this.usuario)
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
}

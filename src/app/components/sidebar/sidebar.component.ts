import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
//import { AuthService } from "src/app/services/auth/auth.service";

/** Interfaz para informacion de las rutas. */
declare interface RouteInfo {
    /** Path */
    path: string;

    /** Titulo */
    title: string;

    /** Icono */
    icon: string;

    /** Clase */
    class: string;
}

/** Componente para la barra lateral de navegación del administrador. */
export const ROUTES: RouteInfo[] = [
    { path: "/admin-layout/usuarios", title: "Usuarios",  icon: "ni-single-02 text-white", class: "" },
    { path: "/admin-layout/form-usuario", title: "Nuevo Usuario",  icon: "ni-badge text-white", class: "" },
    /*{ path: "/admin-layout/estaciones", title: "Estaciones",  icon: "ni-building text-white", class: "" },
    { path: "/admin-layout/form-estacion", title: "Nueva Estación",  icon: "ni-fat-add text-white", class: "" },
    { path: "/admin-layout/variables", title: "Variables",  icon: "ni-collection text-white", class: "" },
    { path: "/admin-layout/form-variable", title: "Nueva Variable",  icon: "ni-sound-wave text-white", class: "" },
    { path: "/admin-layout/asignacion", title: "Asignar Variables",  icon: "ni-tag text-white", class: "" },
    { path: "/admin-layout/roles", title: "Asignar/Editar Roles",  icon: "ni-badge text-white", class: "" },
    { path: "/admin-layout/horarios", title: "Horarios",  icon: "ni-watch-time text-white", class: "" },
    { path: "/admin-layout/instrumentos", title: "Instrumentos",  icon: "ni-ruler-pencil text-white", class: "" },
    { path: "/admin-layout/tiposInstrumentos", title: "Tipos de Instrumentos",  icon: "ni-box-2 text-white", class: "" },
    { path: "/admin-layout/registros", title: "Editar Registros",  icon: "ni-collection text-white", class: "" },*/
];

/**
 * Componente de sidebar
 */
@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {

    /** Items del menu */
    public menuItems!: any[];

    /** Esta o no colapsado */
    public isCollapsed = true;

    /** Constructor */
    constructor(
        private router: Router,
        //private authService: AuthService
        ) { }

    /** Inicializador. */
    ngOnInit(): void {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.router.events.subscribe(() => {
            this.isCollapsed = true;
        });
    }

    /** Cierra sesion en la página. */
    logout(): void{
        //this.authService.logout();
        this.router.navigate(["/auth-layout/login"]);
    }
}

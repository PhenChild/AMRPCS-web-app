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
    { path: "/obs-layout/usuarios", title: "Observadores", icon: "fa-user", class: "" },
    { path: "/obs-layout/estaciones", title: "Estaciones", icon: "fa-building", class: "" },
    { path: "/obs-layout/reportes", title: "Precipitación", icon: "fa-file-alt", class: "" },
    { path: "/obs-layout/acumulados", title: "Precipitación Acumulada", icon: "fa-file-alt", class: "" },
    { path: "/obs-layout/graficos", title: "Graficos", icon: "fa-chart-bar", class: "" },
    { path: "/obs-layout/acercade", title: "Acerca de", icon: "fa-info-circle", class: "active-pro" },
];

/**
 * Componente de sidebar
 */
@Component({
    selector: "app-sidebar-obs",
    templateUrl: "./sidebar-obs.component.html",
    styleUrls: ["./sidebar-obs.component.scss"]
})
export class SidebarObsComponent implements OnInit {

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
    logout(): void {
        //this.authService.logout();
        this.router.navigate(["/auth-layout/login"]);
    }
}

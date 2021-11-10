import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

/**
 * Componente para la autenticación
 */
@Component({
    selector: "app-auth-layout",
    templateUrl: "./auth-layout.component.html",
    styleUrls: ["./auth-layout.component.scss"]
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

    /** Fecha */
    test: Date = new Date();

    /** Booleano si esta collapsed */
    public isCollapsed = true;

    /**
     * Constructor
     * @param router
     */
    constructor(private router: Router) { }

    /**
     * Inicialización del Layout
     */
    ngOnInit(): void {
        const html = document.getElementsByTagName("html")[0];
        html.classList.add("auth-layout");
        const body = document.getElementsByTagName("body")[0];
        body.classList.add("bg-gradient-default");
        this.router.events.subscribe(() => {
            this.isCollapsed = true;
        });

    }
    /**
     * Elimina los operadores de los datatables
     */
    ngOnDestroy(): void {
        const html = document.getElementsByTagName("html")[0];
        html.classList.remove("auth-layout");
        const body = document.getElementsByTagName("body")[0];
        body.classList.remove("bg-yellow");
    }
}

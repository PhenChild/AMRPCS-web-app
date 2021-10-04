import { Component, OnInit } from "@angular/core";
import {ViewEncapsulation} from "@angular/core";

/**
 * Componente para la pagina de admin.
 */
@Component({
    selector: "app-admin-layout",
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit {

    /**
     * Constructor
     */
    constructor() { }

    /**
     * Inicializador
     */
    ngOnInit(): void {
    }

}

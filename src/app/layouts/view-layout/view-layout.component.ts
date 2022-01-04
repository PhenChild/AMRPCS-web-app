import { Component, OnInit } from "@angular/core";
import {ViewEncapsulation} from "@angular/core";

/**
 * Componente para la pagina de admin.
 */
@Component({
    selector: "app-view-layout",
    templateUrl: "./view-layout.component.html",
    styleUrls: ["./view-layout.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ViewLayoutComponent implements OnInit {

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

import { Component, OnInit } from "@angular/core";
import {ViewEncapsulation} from "@angular/core";

/**
 * Componente para la pagina de admin.
 */
@Component({
    selector: "app-obs-layout",
    templateUrl: "./obs-layout.component.html",
    styleUrls: ["./obs-layout.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class ObsLayoutComponent implements OnInit {

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

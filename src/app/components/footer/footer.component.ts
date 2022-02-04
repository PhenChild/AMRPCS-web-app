import { Component, OnInit } from "@angular/core";

/** Pie de pagina*/
@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {

    d = new Date();

    /** Constructor */
    constructor() { }

    /** Inicializador */
    ngOnInit(): void {
    }

}

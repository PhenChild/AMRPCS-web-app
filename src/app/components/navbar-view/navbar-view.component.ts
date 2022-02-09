import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar-view/sidebar-view.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";

/** Barra de navegacion de la página. */
@Component({
    selector: "app-navbar-view",
    templateUrl: "./navbar-view.component.html",
    styleUrls: ["./navbar-view.component.scss"]
})
export class NavbarViewComponent implements OnInit {
    /** Página actual. */
    public focus: any;

    /** Lista de titulos de paginas. */
    public listTitles: any[] | undefined;

    /** Localización */
    public location: Location;

    /** Constructor */
    constructor(
        location: Location,  
        private element: ElementRef, 
        private router: Router, 
        private authService: AuthService
        ) {
        this.location = location;
    }

    /** Inicializador */
    ngOnInit(): void {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
    }

    /** Obtener el titulo del componente. */
    getTitle(): string{
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === "#"){
            titlee = titlee.slice( 1 );
        }
        if(titlee === "/obs-layout/acercade"){
            return "Acerca De"
        }
        else if(titlee === "/obs-layout/perfil"){
            return "Mi Perfil"
        }
        if(this.listTitles != undefined){
            for (let item = 0; item < this.listTitles.length; item++){
                if (this.listTitles[item].path === titlee.split(";")[0]){
                    return this.listTitles[item].title;
                }
            }
        }
        return "Undefined";
    }

    /** Obtiene el nombre de usuario. */
    getUser(): any{
        return sessionStorage.getItem("user");
    }

    getImage(): any{
        return sessionStorage.getItem("foto");
    }

    hasImage(): boolean{
        var foto = sessionStorage.getItem("foto")
        if ( foto != "undefined"){
            return true;
        }else{
            return false;
        }
    }

    /** Cierra sesion en la página. */
    logout(): void{
        this.authService.logout();
        this.router.navigate(["/auth-layout/login"]);
    }

}

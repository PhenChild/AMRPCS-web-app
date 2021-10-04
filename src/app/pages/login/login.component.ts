import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm} from "@angular/forms";
//import { AuthService} from "../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
//import { AccessToken } from "../../modelos/accessToken";


/**
 * Componente para la pagina de login
 */
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})

export class LoginComponent implements OnInit, OnDestroy {

    /** Usuario a logearse */
    usuario = {
        email: "",
        password: "",
    };

    /**
     * Token de autenticación
     */
    //token: AccessToken;

    /**
     * Cosntructor
     * @param authService
     * @param router
     * @param tService
     */
    constructor(
        //private authService: AuthService,
        private router: Router,
        private tService: ToastrService
    ) {}

    /**
     * Inicialización
     */
    ngOnInit(): void {
    }

    /**
     * Cerrar la página
     */
    ngOnDestroy(): void {
    }

    /**
     * Envio del usuario con su contraseña
     * @param formLogin formulario de login
     */
    onSubmit(formLogin: NgForm): void {
        /*this.authService.login(this.usuario)
            .subscribe(
                data => {
                    this.token = (data as any);
                    sessionStorage.setItem("token", this.token.accessToken);
                    sessionStorage.setItem("user", this.token.email);
                    this.router.navigate(["/admin-layout/usuarios"]);
                },
                err => {
                    console.log(err);
                    this.tService.error("Usuario o Contraseña Incorrecta.", "Error en inicio de sesion");
                }
            );*/
    }
}

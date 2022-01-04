import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm} from "@angular/forms";
import { AuthService} from "../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { AccessToken } from "../../models/accessToken";
import { User } from "src/app/models/user";


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
     user!: User;

    /**
     * Cosntructor
     * @param authService
     * @param router
     * @param tService
     */
    constructor(
        private authService: AuthService,
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
        this.authService.login(this.usuario)
            .subscribe(
                (data: any) => {
                    console.log(data)
                    this.user = (data as any);
                    sessionStorage.setItem("token", this.user.token);
                    sessionStorage.setItem("user", this.user.email);
                    sessionStorage.setItem("foto",this.user.foto);
                    //sessionStorage.setItem("userFoto", this.user.foto);
                    if(this.user.role == 'admin'){
                        this.router.navigateByUrl("/admin-layout/usuarios");
                    }else if(this.user.role == 'observer'){
                        this.router.navigateByUrl("/obs-layout/usuarios");
                    }
                },
                (err: any) => {
                    console.log(err);
                    this.tService.error("Usuario o Contraseña Incorrecta.", "Error en inicio de sesion");
                }
            );
    }
}

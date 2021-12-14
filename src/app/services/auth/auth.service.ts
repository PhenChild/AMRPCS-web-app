import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "src/app/models/user";

/**
 * root
 */
@Injectable({
    providedIn: "root"
})

/**
 * CLase para autenticacion
 */
export class AuthService {
    /** Url de conexión */
     dbURL = "https://ciifen.loca.lt/api/"
    //dbURL = "";

    /**
     * Constructor
     * @param http http
     */
    constructor(private http: HttpClient) { }

    /**
     * uduarios administrador
     * @param usuario administrador
     */
    login(usuario: any): any{
        return this.http.post(this.dbURL + "users/signin", usuario);
    }

    /**
     * token de autenticacion
     * @param token token de autenticacion con usuario envio
     */
    logout(): void{
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }

    /**
     * token
     * @returns token verificacion
     */
    loggedIn(): boolean{
        return !!sessionStorage.getItem("token");
        // return true;
    }

}

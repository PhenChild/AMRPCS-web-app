import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { Constants } from "../models/constants";

/**
 * Injectable
 */
@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    /**
     * Constructor
     * @param authService
     * @param router
     */
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    /**
     * Funcion para saber si puede ser activo
     * @returns
     */
    canActivate(): boolean {
        let role = sessionStorage.getItem("role")
        if (!!sessionStorage.getItem("token") && !!role && role == Constants.shaadmin) {
            return true;
        } else {
            this.router.navigate(["/auth-layout/login"]);
            return false;
        }
    }

}

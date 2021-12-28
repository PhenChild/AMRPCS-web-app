import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../models/user";
import { environment } from "src/environments/environment";
import { NgbPaginationNumber } from "@ng-bootstrap/ng-bootstrap";

/**
 * Root
 */
@Injectable({
    providedIn: "root"
})
export class DbService {

    /** Lista de usuarios */
    usuarios: User[] = [];

    /** Url de conexión */
    //dbURL = "https://ciifen.loca.lt/api/";
    dbURL = "http://ca3b-181-199-40-123.ngrok.io/api/";

    /**
     * Constructor
     * @param http
     */
    constructor(private http: HttpClient) { }

    /**
     * Cabezera
     * @returns
     */
    getHeader(): any {
        if (sessionStorage.getItem("token") != null) {
            return {
                "x-access-token": sessionStorage.getItem("token")
            };
        } else {
            return {};
        }
    }


    /**
    * Obtención de usuarios
    * @returns respuesta del servidor
    */
    getUsuarios(filtro: any): any {
        var query = ""
        if (filtro.nombre != "") {
            query += "nombre=" + filtro.nombre + "&"
        } if (filtro.email != "") {
            query += "correo=" + filtro.email + "&"
        } if (filtro.rol != "") {
            query += "role=" + filtro.rol + "&"
        }
        return this.http.get(this.dbURL + "getAll/filtro?" + query, { headers: this.getHeader() });
    }

    //*******************************************************

    /**
     * Añadir los usuarios
     * @param usuario usuarios
     * @returns respuesta del servidor
     */
    addUsuario(usuario: User, estaciones: any): any {
        usuario.estaciones = estaciones
        return this.http.post(this.dbURL + "users/signup", usuario, { headers: this.getHeader() });
    }
    /* req.body.email, req.body.password, req.body.nombre, req.body.apellido, req.body.telefono*/


    /**
     * Eliminar usuarios
     * @param usuario usuarios que seran elimiandos
     * @returns respuesta del servidor
     */
    deleteUsuario(usuario: User): any {
        return this.http.post(this.dbURL + "users/delete", { "id": usuario.id }, { headers: this.getHeader() });
    }

    /**
     * Actualización de usuarios
     * @param usuario usuarios
     * @returns respuesta del servidor
     */
    updateUsuario(usuario: any, addedEstaciones: any, deletedEstaciones: any): any {
        return this.http.post(this.dbURL + "users/updateUser", { usuario, addedEstaciones, deletedEstaciones }, { headers: this.getHeader() });
    }// req.body.id, req.body.email, req.body.password, req.body.nombre, req.body.apellido, req.body.telefono


    updateUserProfile(usuario: any): any {
        return this.http.post(this.dbURL + "user/update",
            {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "telefono": usuario.telefono
            }, { headers: this.getHeader() });
    }

    editUserPassword(usuario: any): any {
        return this.http.post(this.dbURL + "user/pass", 
        {
            "id": usuario.id,
            "password": usuario.password
        }, { headers: this.getHeader() });
    }

    getFoto(usuario: any): any {
        return this.http.post(this.dbURL + "users/getPicture", { "id": usuario.id }, { headers: this.getHeader() });
    }
    // OBSERVERS ENDPOINTS

    /**
     * Obtener observadores de una estación
     * @param estacion estación
     * @returns respuesta del servidor
     */
    getObservadores(estacion: { codigo: string; }): any {
        return this.http.post(this.dbURL + "observers/getObsEstacion", estacion, { headers: this.getHeader() });
    }

    // ESTACIONES ENDPOINTS

    /**
     * Obtener Estaciones
     * @returns respuesta del servidor
     */
    getEstaciones(filtro: any): any {
        var query = ""
        if (filtro.nombre != "") {
            query += "nombre=" + filtro.nombre + "&"
        } if (filtro.codigo != "") {
            query += "codigo=" + filtro.codigo + "&"
        } if (filtro.pais != "") {
            query += "nombrePais=" + filtro.pais + "&"
        }
        return this.http.get(this.dbURL + "estacion/getAll/filtro?" + query, { headers: this.getHeader() });
    }

    getEstacionesParaUsuario(filtro: any) {
        var query = ""
        if (filtro.nombre != "") {
            query += "nombre=" + filtro.nombre + "&"
        } if (filtro.codigo != "") {
            query += "codigo=" + filtro.codigo + "&"
        }
        return this.http.get(this.dbURL + "estacion/getAll/filtroSinDivision?" + query, { headers: this.getHeader() });
    }

    getEstacionesUsuario(usuario: any): any {
        return this.http.post(this.dbURL + "observers/getUserEstacion", { "id": usuario.id }, { headers: this.getHeader() });
    }

    /**
     * Eliminar estaciones
     * @param estacion
     * @returns respuesta del servidor
     */
    deleteEstacion(estacion: { id: number; }): any {
        return this.http.post(this.dbURL + "estacion/delete", { "id": estacion.id }, { headers: this.getHeader() });
    }

    /**
     * Añadir estaciones
     * @param estacion estacion
     * @returns respuesta del servidor
     */
    addEstacion(estacion: any): any {
        return this.http.post(this.dbURL + "estacion/new", estacion, { headers: this.getHeader() });
    }// aqui req.body.codigoEstacion, req.body.nombreEstacion, req.body.latitud,
    // req.body.longitud,req.body.altitud,req.body.suelo,req.body.omm

    /**
     * Actualizar estaciones
     * @param estacion estacion
     * @returns respuesta del servidor
     */
    updateEstacion(estacion: any): any {
        delete estacion.foto;
        return this.http.post(this.dbURL + "estacion/update", estacion, { headers: this.getHeader() });
    }

    // PAISES ENDPOINTS

    /**
     * Obtener Paises
     * @returns respuesta del servidor
     */
    getPaises(): any {
        return this.http.get(this.dbURL + "pais/getAll", { headers: this.getHeader() });
    }

    getFiltroPaises(filtro: any): any {
        var query = ""
        if (filtro.nombre != "") {
            query += "nombre=" + filtro.nombre + "&"
        } if (filtro.siglas != "") {
            query += "siglas=" + filtro.siglas + "&"
        }
        return this.http.get(this.dbURL + "pais/getAll/filtro?" + query, { headers: this.getHeader() });
    }

    /**
     * Eliminar Pais
     * @param pais
     * @returns respuesta del servidor
     */
    deletePais(pais: { id: number; }): any {
        return this.http.post(this.dbURL + "pais/delete", { "id": pais.id }, { headers: this.getHeader() });
    }

    /**
     * Añadir Pais
     * @param pais pais
     * @returns respuesta del servidor
     */
    addPais(pais: any): any {
        return this.http.post(this.dbURL + "pais/new", pais, { headers: this.getHeader() });
    }

    /**
     * Actualizar Pais
     * @param pais pais
     * @returns respuesta del servidor
     */
    updatePais(pais: any): any {
        return this.http.post(this.dbURL + "pais/update", pais, { headers: this.getHeader() });
    }

    // DIVISIONES ENDPOINTS

    /**
     * Obtener divisiones
     * @returns respuesta del servidor
     */
    getDivisiones(): any {
        return this.http.get(this.dbURL + "division/getAll", { headers: this.getHeader() });
    }

    getFiltroDivisiones(filtro: any): any {
        var query = ""
        if (filtro.nombre != "") {
            query += "nombre=" + filtro.nombre + "&"
        } if (filtro.pais != "") {
            query += "pais=" + filtro.pais + "&"
        } if (filtro.nivel != "") {
            query += "nivel=" + filtro.nivel + "&"
        }
        return this.http.get(this.dbURL + "division/getAll/filtro?" + query, { headers: this.getHeader() });
    }

    /**
     * Eliminar division
     * @param division
     * @returns respuesta del servidor
     */
    deleteDivision(division: { id: number; }): any {
        return this.http.post(this.dbURL + "division/delete", { "id": division.id }, { headers: this.getHeader() });
    }

    /**
     * Añadir division
     * @param division division
     * @returns respuesta del servidor
     */
    addDivision(division: any): any {
        return this.http.post(this.dbURL + "division/new", division, { headers: this.getHeader() });
    }

    /**
     * Actualizar division
     * @param division division
     * @returns respuesta del servidor
     */
    updateDivision(division: any): any {
        return this.http.post(this.dbURL + "division/update", division, { headers: this.getHeader() });
    }

    /**
    * Obtener las divisiones superiores por pais y nivel
    * @param idPais id del pais
    * @param nivel nivel de la nueva division
    * @returns respuesta del servidor
    */
    getDivisionesSuperiores(idPais: number, nivel: number) {
        return this.http.post(this.dbURL + "division/getDivisionesSuperiores", { "idPais": idPais, "nivel": nivel }, { headers: this.getHeader() });
    }

    // REPORTES ENDPOINTS

    /**
     * Obtener reportes
     * @returns respuesta del servidor
     */
    getReportes(filtro: any): any {
        var query = ""
        if (filtro.observador != "") {
            query += "observador=" + filtro.observador + "&"
        } if (filtro.estacion != "") {
            query += "estacion=" + filtro.estacion + "&"
        } if (filtro.fechaInicio != "") {
            query += "fechaInicio=" + filtro.fechaInicio + "&"
        } if (filtro.fechaFin != "") {
            query += "fechaFin=" + filtro.fechaFin + "&"
        }
        return this.http.get(this.dbURL + "precipitacion/getAll/filtro?" + query, { headers: this.getHeader() });
    }

    getReportesGraficos(filtro: any): any {
        var query = ""
        if (filtro.estacion != "") {
            query += "estacion=" + filtro.estacion + "&"
        } if (filtro.fechaInicio != "") {
            query += "fechaInicio=" + filtro.fechaInicio + "&"
        } if (filtro.fechaFin != "") {
            query += "fechaFin=" + filtro.fechaFin + "&"
        }
        return this.http.get(this.dbURL + "precipitacion/getAll/filtroGrafico?" + query, { headers: this.getHeader() });
    }

    /**
     * Obtener reportes
     * @returns respuesta del servidor
     */
    getReportesAcumulados(filtro: any): any {
        var query = ""
        if (filtro.observador != "") {
            query += "observador=" + filtro.observador + "&"
        } if (filtro.estacion != "") {
            query += "estacion=" + filtro.estacion + "&"
        } if (filtro.fechaInicio != "") {
            query += "fechaInicio=" + filtro.fechaInicio + "&"
        } if (filtro.fechaFin != "") {
            query += "fechaFin=" + filtro.fechaFin + "&"
        }
        return this.http.get(this.dbURL + "acumulado/getAll/filtro?" + query, { headers: this.getHeader() });
    }

    updateUserPassword(usuario: any): any {
        return this.http.post(this.dbURL + "users/updatePass", usuario, { headers: this.getHeader() });
    }


    getDivisionesPaises(pais: any): any {
        return this.http.post(this.dbURL + "division/getDivisionesPaisNivelOne", { "idPais": pais }, { headers: this.getHeader() });
    }

    getDivDivisiones(division: any, nivel: any): any {
        return this.http.post(this.dbURL + "division/getDivisionesInferiores", { "id": division, "nivel": nivel }, { headers: this.getHeader() });
    }

    getFotoEstacion(estacion: any) {
        return this.http.post(this.dbURL + "estacion/getPicture", estacion, { headers: this.getHeader() });
    }

    getProfile() {
        return this.http.get(this.dbURL + "getMe", { headers: this.getHeader() });
    }

}

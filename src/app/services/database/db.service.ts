import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../models/user";
import { environment } from "src/environments/environment";

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
    dbURL = "https://ciifen.loca.lt/api/";
    //dbURL = "";

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
    getUsuarios(): any {
        return this.http.get(this.dbURL + "getAll", { headers: this.getHeader() });
    }

    //*******************************************************

    /**
     * Añadir los usuarios
     * @param usuario usuarios
     * @returns respuesta del servidor
     */
    addUsuario(usuario: User): any {
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
    updateUsuario(usuario: any): any {
        return this.http.post(this.dbURL + "users/updateUser", usuario, { headers: this.getHeader() });
    }// req.body.id, req.body.email, req.body.password, req.body.nombre, req.body.apellido, req.body.telefono

    // OBSERVERS ENDPOINTS

    /**
     * Obtener observadores de una estación
     * @param estacion estación
     * @returns respuesta del servidor
     */
    getObservadores(estacion: { codigo: string; }): any {
        return this.http.get(this.dbURL + "observers/getObsByEst/" + estacion.codigo, { headers: this.getHeader() });
    }

    /**
     * Añadir observadores
     * @param observador observador
     * @returns respuesta del servidor
     */
    addObservador(observador: any): any {
        return this.http.post(this.dbURL + "observers/new", observador, { headers: this.getHeader() });
    }// aqui solo se requiere req.body.codigoestacion, req.body.userid,

    // ESTACIONES ENDPOINTS

    /**
     * Obtener Estaciones
     * @returns respuesta del servidor
     */
    getEstaciones(): any {
        return this.http.get(this.dbURL + "estacion/getAll", { headers: this.getHeader() });
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
     getReportes(): any {
        return this.http.get(this.dbURL + "precipitacion/getAll", { headers: this.getHeader() });
    }

}

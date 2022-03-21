import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { DbService } from '../database/db.service';

/**
 * root
 */
@Injectable({
  providedIn: 'root',
})

/**
 * CLase para autenticacion
 */
export class AuthService {
  /** Url de conexión */
  //dbURL = "https://ciifen.loca.lt/api/"
  dbURL = environment.apiURL + 'api/';

  /**
   * Constructor
   * @param http http
   */
  constructor(private http: HttpClient, private dbService: DbService) {}

  /**
   * uduarios administrador
   * @param usuario administrador
   */
  login(usuario: any): any {
    return this.http.post(this.dbURL + 'users/signin', usuario);
  }

  /**
   * token de autenticacion
   * @param token token de autenticacion con usuario Envío
   */
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
  }
}

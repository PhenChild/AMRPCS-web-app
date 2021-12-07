/** Token de accesso para autorización de la página. */
export class AccessToken {
    /** Id del usuario */
    id!: string;

    /** Email del usuario. */
    email!: string;

    /** Rol del usuario. */
    role!: string;

    /** Token de acceso del usuario. */
    accessToken!: string;

    constructor(){
        this.id = "";
        this.email = "";
        this.role = "";
        this.accessToken = "";
    }
}

/** Modelo para los observadores. */
export class Observador{

    /** Id del observador. */
    id!: string;

    /** Nombre del usuario observador */
    User!: {
        nombre: string;
        apellido: string;
        email: string;
    }
}

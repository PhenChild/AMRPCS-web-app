/** Modelo para las divisiones. */
export class Division{

    /** Id del pais. */
    id!: number;

    /** Id del padre de la división */
    idPadre!: number;

    /**Id del pais al que pertenece la division */
    idPais!: number;

    /** Nombre de la division */
    nombre!: string;

    /** Nivel de la division. */
    nivel!: number;

    Pai!:{ nombre: string};
    nombrePadre!:string;
    
    audCreatedAt!: string;

    audDeletedAt!: string;

    audUpdatedAt!: string;

    state!: string;

}

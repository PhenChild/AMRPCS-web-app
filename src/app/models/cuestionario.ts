/** Modelo para los reportes. */
export class Cuestionario{

    /** Id del registro. */
    id!: string;

    fecha!: string;

    respSuelo!: number;
    respVeg!: number;
    respPrec!: number;
    respTempPrec!: number;
    respTemps!: number;
    respGana!: number;

    comentario!: string;

    Observador!: {
        Estacion: {
            id: number;
            codigo: string;
            nombre: string;
        },
        User:{
            id: number;
            nombre: string;
            apellido: string;
        }
    };

    estacion!: string;

    audCreatedAt!: string;

    audDeletedAt!: string;

    audUpdatedAt!: string;
}

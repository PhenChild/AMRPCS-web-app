/** Modelo para los reportes. */
export class Reporte {

    /** Id del registro. */
    id!: string;

    fecha!: string;

    valor!: number;

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

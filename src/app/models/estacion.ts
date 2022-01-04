/** Modelo para las estaciones. */
export class Estacion {
    id!: number;

    /** Codigo de la estación. */
    codigo!: string;

    Division!:{
        Pai:{
            nombre: String;
        }
        nombre: String;
    }
    /** Nombre de la estación. */
    nombre!: string;

    direccion!: string;

    referencias!: string;

    foto!: string;

    hasPluviometro!: boolean;

    idUbicacion!: string;

    posicion!: {
        coordinates: number[];
    };

    /** Latitud de la estación. */
    latitud!: number;

    /** Longitud de la estación. */
    longitud!: number;

    /** Altitud de la estación. */
    altitud!: number;

    /** Fecha de creación de la estación. */
    audCreatedAt!: string;

    /** Fecha de actualización de la estación. */
    audDeletedAt!: string;

    audUpdatedAt!: string;

    division1: any;
    division2: any;
    division3: any;

}

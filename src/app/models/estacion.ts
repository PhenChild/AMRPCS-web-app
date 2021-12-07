/** Modelo para las estaciones. */
export class Estacion {
    id!: number;

    /** Codigo de la estación. */
    codigo!: string;

    /** Nombre de la estación. */
    nombre!: string;

    direccion!: string;

    referencias!: string;

    foto!: string;

    hasPluviometro!: boolean;

    idUbicacion!: number;

    posicion!: {
        coordinates: number[];
    };

    /** Latitud de la estación. */
    latitud!: number;

    /** Longitud de la estación. */
    longitud!: number;

    /** Altitud de la estación. */
    altitud!: number;

    /** Tipo de suelo de la estación. */
    suelo!: string;

    /** Codigo OMM de la estación. */
    omm!: string;

    /** Id del jefe de la estación. */
    jefeId!: string;

    /** Fecha de creación de la estación. */
    audCreatedAt!: string;

    /** Fecha de actualización de la estación. */
    audDeletedAt!: string;

    audUpdatedAt!: string;

}

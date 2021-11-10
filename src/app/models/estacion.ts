/** Modelo para las estaciones. */
export class Estacion {
    /** Codigo de la estación. */
    codigo!: string;

    /** Nombre de la estación. */
    nombreEstacion!: string;

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
    createdAt!: string;

    /** Fecha de actualización de la estación. */
    updatedAt!: string;
}

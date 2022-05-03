/** Modelo para los paises. */
export class Ocupacion {
  /** Id del pais. */
  id!: number;

  descripcion!: string;

  sector!: string;

  Sector!: {
    descripcion: string;
  };

  idSector!: string;

  audCreatedAt!: string;

  audDeletedAt!: string;

  audUpdatedAt!: string;

  state!: string;
}

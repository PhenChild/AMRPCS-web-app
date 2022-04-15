/** Modelo para los reportes. */
export class ReporteExtrema {
  /** Id del registro. */
  id!: string;

  fecha!: string;

  inundacion!: number;

  granizo!: number;

  rayos!: number;

  deslizamiento!: number;

  vientos!: number;

  state!: string;

  notificacion!: boolean;

  comentario!: string;

  Observador!: {
    Estacion: {
      id: number;
      codigo: string;
      nombre: string;
    };
    User: {
      id: number;
      nombre: string;
      apellido: string;
    };
  };

  estacion!: string;

  audCreatedAt!: string;

  audDeletedAt!: string;

  audUpdatedAt!: string;
}

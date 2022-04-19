/** Modelo para los reportes. */
export class ReporteAcumulado {
  /** Id del registro. */
  id!: string;

  fechaInicio!: string;

  fechaFin!: string;

  valor!: number;

  comentario!: string;

  state!: string;

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

/** Modelo para los reportes. */
export class Cuestionario {
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
  
  total!: number;

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

  estacion!: number;

  audCreatedAt!: string;

  audDeletedAt!: string;

  audUpdatedAt!: string;
}

import { Routes } from '@angular/router';

import { UsuariosComponent } from '../../pages/usuarios/usuarios.component';
import { FormUsuarioComponent } from '../../pages/form-usuario/form-usuario.component';

import { EstacionesComponent } from '../../pages/estaciones/estaciones.component';
import { FormEstacionComponent } from '../../pages/form-estacion/form-estacion.component';
import { PaisesComponent } from '../../pages/paises/paises.component';
import { DivisionesComponent } from 'src/app/pages/divisiones/divisiones.component';
import { ReportesComponent } from 'src/app/pages/reportes/reportes.component';
import { AcumuladosComponent } from 'src/app/pages/acumulados/acumulados.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';

import { AcercadeComponent } from 'src/app/pages/acercade/acercade.component';
import { GraficosComponent } from 'src/app/pages/graficos/graficos.component';
import { OcupacionComponent } from 'src/app/pages/ocupacion/ocupacion.component';
import { CuestionariosComponent } from 'src/app/pages/cuestionarios/cuestionarios.component';
import { ExtremaComponent } from 'src/app/pages/extrema/extrema.component';

export const adminLayoutRoutes: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'form-usuario', component: FormUsuarioComponent },
  { path: 'estaciones', component: EstacionesComponent },
  { path: 'form-estacion', component: FormEstacionComponent },
  { path: 'paises', component: PaisesComponent },
  { path: 'divisiones', component: DivisionesComponent },
  { path: 'ocupacion', component: OcupacionComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'acumulados', component: AcumuladosComponent },
  { path: 'cuestionarios', component: CuestionariosComponent },
  { path: 'extrema', component: ExtremaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'graficos', component: GraficosComponent },
  { path: 'acercade', component: AcercadeComponent },
];

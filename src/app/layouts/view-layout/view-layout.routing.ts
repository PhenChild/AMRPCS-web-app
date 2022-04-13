import { Routes } from '@angular/router';

import { UsuariosComponent } from '../../pages/usuarios/usuarios.component';

import { EstacionesComponent } from '../../pages/estaciones/estaciones.component';
import { ReportesComponent } from 'src/app/pages/reportes/reportes.component';
import { AcumuladosComponent } from 'src/app/pages/acumulados/acumulados.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';

import { AcercadeComponent } from 'src/app/pages/acercade/acercade.component';
import { GraficosComponent } from 'src/app/pages/graficos/graficos.component';
import { ExtremaComponent } from 'src/app/pages/extrema/extrema.component';
import { CuestionariosComponent } from 'src/app/pages/cuestionarios/cuestionarios.component';

export const viewLayoutRoutes: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'estaciones', component: EstacionesComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'acumulados', component: AcumuladosComponent },
  { path: 'cuestionarios', component: CuestionariosComponent },
  { path: 'extrema', component: ExtremaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'graficos', component: GraficosComponent },
  { path: 'acercade', component: AcercadeComponent },
];

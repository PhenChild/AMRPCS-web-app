import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { FormUsuarioComponent } from 'src/app/pages/form-usuario/form-usuario.component';
import { EstacionesComponent } from 'src/app/pages/estaciones/estaciones.component';
import { FormEstacionComponent } from 'src/app/pages/form-estacion/form-estacion.component';
import { PaisesComponent } from 'src/app/pages/paises/paises.component';
import { GraficosComponent } from 'src/app/pages/graficos/graficos.component';

import { DivisionesComponent } from 'src/app/pages/divisiones/divisiones.component';
import { ReportesComponent } from 'src/app/pages/reportes/reportes.component';
import { AcumuladosComponent } from 'src/app/pages/acumulados/acumulados.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { AcercadeComponent } from 'src/app/pages/acercade/acercade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FileUploadModule } from 'ng2-file-upload';
import { CuestionariosComponent } from './cuestionarios/cuestionarios.component';
import { OcupacionComponent } from './ocupacion/ocupacion.component';
import { MisReportesComponent } from './mis-reportes/mis-reportes.component';
import { ExtremaComponent } from './extrema/extrema.component';
import { FormulariosModule } from '../formularios/formularios.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    DataTablesModule,
    FileUploadModule,
    FormulariosModule,
  ],
  declarations: [
    UsuariosComponent,
    FormUsuarioComponent,
    EstacionesComponent,
    FormEstacionComponent,
    PaisesComponent,
    DivisionesComponent,
    ReportesComponent,
    AcumuladosComponent,
    PerfilComponent,
    GraficosComponent,
    AcercadeComponent,
    CuestionariosComponent,
    OcupacionComponent,
    MisReportesComponent,
    ExtremaComponent,
  ],
  exports: [
    UsuariosComponent,
    FormUsuarioComponent,
    EstacionesComponent,
    FormEstacionComponent,
    PaisesComponent,
    DivisionesComponent,
    ReportesComponent,
    AcumuladosComponent,
    PerfilComponent,
    GraficosComponent,
    AcercadeComponent,
  ],
})
export class PagesModule {}

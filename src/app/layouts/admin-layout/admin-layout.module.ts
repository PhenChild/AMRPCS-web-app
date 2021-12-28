import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http"; 
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule , ReactiveFormsModule } from "@angular/forms";

import { adminLayoutRoutes } from "./admin-layout.routing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UsuariosComponent } from "../../pages/usuarios/usuarios.component";
import { FormUsuarioComponent } from "../../pages/form-usuario/form-usuario.component";
import { EstacionesComponent } from "../../pages/estaciones/estaciones.component";
import { FormEstacionComponent } from "../../pages/form-estacion/form-estacion.component";
import { PaisesComponent } from "src/app/pages/paises/paises.component";
import { GraficosComponent } from '../../pages/graficos/graficos.component';

import { DataTablesModule } from "angular-datatables";
import { DivisionesComponent } from "src/app/pages/divisiones/divisiones.component";
import { ReportesComponent } from "src/app/pages/reportes/reportes.component";
import { AcumuladosComponent } from 'src/app/pages/acumulados/acumulados.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { AcercadeComponent } from 'src/app/pages/acercade/acercade.component';
import {FileUploadModule} from "ng2-file-upload"; 
import { PagesModule } from "src/app/pages/pages.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(adminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        FileUploadModule,
        PagesModule
    ],
    declarations: [
    ]
})

export class AdminLayoutModule {}

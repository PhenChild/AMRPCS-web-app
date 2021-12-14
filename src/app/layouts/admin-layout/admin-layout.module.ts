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

import { DataTablesModule } from "angular-datatables";
import { DivisionesComponent } from "src/app/pages/divisiones/divisiones.component";
import { ReportesComponent } from "src/app/pages/reportes/reportes.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(adminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule
    ],
    declarations: [
        UsuariosComponent,
        FormUsuarioComponent,
        EstacionesComponent,
        FormEstacionComponent,
        PaisesComponent,
        DivisionesComponent,
        ReportesComponent
    ]
})

export class AdminLayoutModule {}

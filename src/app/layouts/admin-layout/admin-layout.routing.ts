import { Routes } from "@angular/router";


import { UsuariosComponent } from "../../pages/usuarios/usuarios.component";
import { FormUsuarioComponent } from "../../pages/form-usuario/form-usuario.component";

import { EstacionesComponent } from "../../pages/estaciones/estaciones.component";
import { FormEstacionComponent } from "../../pages/form-estacion/form-estacion.component";
import { PaisesComponent } from "../../pages/paises/paises.component";
import { DivisionesComponent } from "src/app/pages/divisiones/divisiones.component";
import { ReportesComponent } from "src/app/pages/reportes/reportes.component";
import { AcumuladosComponent } from "src/app/pages/acumulados/acumulados.component";
import { PerfilComponent } from "src/app/pages/perfil/perfil.component";

import { AcercadeComponent } from "src/app/pages/acercade/acercade.component";

export const adminLayoutRoutes: Routes = [
    { path: "usuarios",         component: UsuariosComponent },
    { path: "form-usuario",     component: FormUsuarioComponent },
    { path: "estaciones",       component: EstacionesComponent },
    { path: "form-estacion",    component: FormEstacionComponent },
    { path: "paises",        component: PaisesComponent },
    { path: "divisiones",        component: DivisionesComponent },
    { path: "reportes",        component: ReportesComponent },
    { path: "acumulados",        component: AcumuladosComponent },
    { path: "perfil",        component: PerfilComponent },
    { path: "acercade",        component: AcercadeComponent },

];


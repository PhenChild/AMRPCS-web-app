import { NgModule } from '@angular/core';
import { CommonModule, } from "@angular/common";
import { BrowserModule  } from "@angular/platform-browser";
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { ObsLayoutComponent } from './layouts/obs-layout/obs-layout.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/auth-layout/login",
    pathMatch: "full",
}, {
    path: "admin-layout",
    component: AdminLayoutComponent,
    children: [
        {
            path: "",
            loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule),
            //canActivate: [AuthGuard]
        }
    ]
}, {
    path: "auth-layout",
    component: AuthLayoutComponent,
    children: [
        {
            path: "",
            loadChildren: () => import("./layouts/auth-layout/auth-layout.module").then(m => m.AuthLayoutModule)
        }
    ]
},{
    path: "obs-layout",
    component: ObsLayoutComponent,
    children: [
        {
            path: "",
            loadChildren: () => import("./layouts/obs-layout/obs-layout.module").then(m => m.ObsLayoutModule)
        }
    ]
},
{
    path: "**",
    redirectTo: "dashboard"
}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ObsLayoutComponent } from './layouts/obs-layout/obs-layout.component';
import { ViewLayoutComponent } from './layouts/view-layout/view-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthObsGuard } from './guards/auth-obs.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth-layout/login',
    pathMatch: 'full',
  },
  {
    path: 'admin-layout',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/admin-layout/admin-layout.module').then(
            (m) => m.AdminLayoutModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'auth-layout',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  {
    path: 'obs-layout',
    component: ObsLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/obs-layout/obs-layout.module').then(
            (m) => m.ObsLayoutModule
          ),
        canActivate: [AuthObsGuard],
      },
    ],
  },
  {
    path: 'view-layout',
    component: ViewLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/view-layout/view-layout.module').then(
            (m) => m.ViewLayoutModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth-layout/login',
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  exports: [RouterModule],
})
export class AppRoutingModule {}

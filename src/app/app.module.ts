import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from '././app-routing.module';
import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { ObsLayoutComponent } from './layouts/obs-layout/obs-layout.component';
import { ViewLayoutComponent } from './layouts/view-layout/view-layout.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { httpInterceptProviders } from './services/http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ObsLayoutComponent,
    ViewLayoutComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [httpInterceptProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}

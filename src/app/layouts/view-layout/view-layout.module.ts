import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { DataTablesModule } from 'angular-datatables';
import { PagesModule } from 'src/app/pages/pages.module';
import { viewLayoutRoutes } from './view-layout.routing';
import { FormulariosModule } from 'src/app/formularios/formularios.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(viewLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    DataTablesModule,
    FileUploadModule,
    PagesModule,
    FormulariosModule,
  ],
  declarations: [],
})
export class ViewLayoutModule {}

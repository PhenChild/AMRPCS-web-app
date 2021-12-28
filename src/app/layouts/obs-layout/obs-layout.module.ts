import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FileUploadModule } from "ng2-file-upload";
import { obsLayoutRoutes } from "./obs-layout.routing";
import { DataTablesModule } from "angular-datatables";
import { PagesModule } from "src/app/pages/pages.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(obsLayoutRoutes),
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

export class ObsLayoutModule { }

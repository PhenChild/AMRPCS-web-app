import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { authLayoutRoutes } from "./auth-layout.routing";
import { LoginComponent } from "../../pages/login/login.component";
import { ToastrModule } from "ngx-toastr";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(authLayoutRoutes),
        FormsModule,
        ToastrModule.forRoot(),
    ],
    declarations: [
        LoginComponent,
    ]
})
export class AuthLayoutModule { }

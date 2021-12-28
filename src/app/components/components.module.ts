import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SidebarObsComponent } from "./sidebar-obs/sidebar-obs.component";
import { NavbarObsComponent } from "./navbar-obs/navbar-obs.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        NavbarObsComponent,
        SidebarComponent,
        SidebarObsComponent,

    ],
    exports: [
        FooterComponent,
        NavbarComponent,
        NavbarObsComponent,
        SidebarComponent,
        SidebarObsComponent
    ]
})
export class ComponentsModule { }

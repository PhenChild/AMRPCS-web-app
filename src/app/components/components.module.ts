import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SidebarObsComponent } from "./sidebar-obs/sidebar-obs.component";
import { NavbarObsComponent } from "./navbar-obs/navbar-obs.component";
import { NavbarViewComponent } from "./navbar-view/navbar-view.component";
import { SidebarViewComponent } from "./sidebar-view/sidebar-view.component";

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
        NavbarViewComponent,
        SidebarComponent,
        SidebarObsComponent,
        SidebarViewComponent,
    ],
    exports: [
        FooterComponent,
        NavbarComponent,
        NavbarObsComponent,
        NavbarViewComponent,
        SidebarComponent,
        SidebarObsComponent,
        SidebarViewComponent
    ]
})
export class ComponentsModule { }

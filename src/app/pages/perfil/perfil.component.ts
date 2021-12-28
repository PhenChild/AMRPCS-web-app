import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  /** Usuario */
  usuario = new User();

  confpassword = "";

  constructor(
    private dbService: DbService,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {
    this.dbService.getProfile()
      .subscribe((data: any) => {
        this.usuario = data
        console.log(data)
      })
  }

  submit(formUsuario: NgForm): void {
    this.dbService.updateUserProfile(this.usuario)
      .subscribe(
        (data: any) => {
          this.tService.success("Usuario actualizado con exito.", "Envio exitoso");
        },
        (err: any) => {
          console.log(err);
          this.tService.error("", "Ha ocurrido un error");
        }
      );
  }

  editarPassword(): void {
    this.usuario.password = "";
    const table = (<HTMLInputElement>document.getElementById("perfil"));
    const form = (<HTMLInputElement>document.getElementById("form-update-password"));
    table.style.display = "none";
    form.style.display = "block";
  }

  submitPassword(formPasswordUsuario: NgForm): void {
    if (this.confpassword == this.usuario.password) {
      this.dbService.editUserPassword(this.usuario)
        .subscribe(
          (data: any) => {
            const table = (<HTMLInputElement>document.getElementById("perfil"));
            const form = (<HTMLInputElement>document.getElementById("form-update-password"));
            table.style.display = "block";
            form.style.display = "none";
            this.tService.success("Contraseña actualizada con exito.", "Envio exitoso");
          },
          (err: any) => {
            console.log(err);
            this.tService.error("", "Ha ocurrido un error");
          }
        );
    } else {
      this.tService.error("", "Las contraseñas deben coincidir");
    }
  }

  cancelarPassword(formPasswordUsuario: NgForm): void {
    const table = (<HTMLInputElement>document.getElementById("perfil"));
    const form = (<HTMLInputElement>document.getElementById("form-update-password"));
    table.style.display = "block";
    form.style.display = "none";
  }

}

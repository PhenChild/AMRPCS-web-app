import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  /** Usuario */
  usuario = new User();

  confpassword = '';

  constructor(private dbService: DbService, private tService: ToastrService) {
    this.uploader = new FileUploader({
      url: dbService.dbURL + 'user/updatePicture',
      method: 'POST',
      itemAlias: 'file',
      queueLimit: 1,
      headers: [
        {
          name: 'x-access-token',
          value: sessionStorage.getItem('token')!,
        },
      ],
    });

    this.response = '';

    this.uploader.response.subscribe((res) => (this.response = res));
  }

  /* Data for upload image */
  url!: string | ArrayBuffer | null;
  format!: string;

  uploader!: FileUploader;

  response!: string;

  isSuccess!: boolean;
  isCancel!: boolean;
  isError!: boolean;

  ngOnInit(): void {
    this.dbService.getProfile().subscribe((data: any) => {
      this.usuario = data;
    });

    this.isCancel = false;
    this.isError = false;
    this.isSuccess = false;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        id: this.usuario.id,
      };
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      const table = <HTMLInputElement>document.getElementById('perfil');
      const form = <HTMLInputElement>(
        document.getElementById('form-update-foto')
      );
      table.style.display = 'block';
      form.style.display = 'none';
      this.tService.success('Foto actualizada con éxito.', 'Envío exitoso');
      this.uploader.clearQueue();
      this.ngOnInit();
    };
  }

  submit(formUsuario: NgForm): void {
    if (formUsuario.valid) {
      if (confirm('¿Desea actualizar su información de perfil?')) {
        this.dbService.updateUserProfile(this.usuario).subscribe(
          (data: any) => {
            this.tService.success(
              'Información de perfil actualizada con éxito.',
              'Envío exitoso'
            );
          },
          (err: any) => {
            this.tService.error('', 'Ha ocurrido un error');
          }
        );
      }
    }
  }

  editarPassword(): void {
    this.usuario.password = '';
    const table = <HTMLInputElement>document.getElementById('perfil');
    const form = <HTMLInputElement>(
      document.getElementById('form-update-password')
    );
    table.style.display = 'none';
    form.style.display = 'block';
  }

  submitPassword(formPasswordUsuario: NgForm): void {
    if (formPasswordUsuario.valid) {
      if (this.confpassword == this.usuario.password) {
        if (confirm('¿Desea actualizar su contraseña?')) {
          this.dbService.editUserPassword(this.usuario).subscribe(
            (data: any) => {
              const table = <HTMLInputElement>document.getElementById('perfil');
              const form = <HTMLInputElement>(
                document.getElementById('form-update-password')
              );
              table.style.display = 'block';
              form.style.display = 'none';
              this.tService.success(
                'Contraseña actualizada con éxito.',
                'Envío exitoso'
              );
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      } else {
        this.tService.error('', 'Las contraseñas deben coincidir');
      }
    }
  }

  cancelarPassword(formPasswordUsuario: NgForm): void {
    const table = <HTMLInputElement>document.getElementById('perfil');
    const form = <HTMLInputElement>(
      document.getElementById('form-update-password')
    );
    table.style.display = 'block';
    form.style.display = 'none';
  }

  editarFoto() {
    const table = <HTMLInputElement>document.getElementById('perfil');
    const form = <HTMLInputElement>document.getElementById('form-update-foto');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  cancelarFoto(): void {
    const table = <HTMLInputElement>document.getElementById('perfil');
    const form = <HTMLInputElement>document.getElementById('form-update-foto');
    table.style.display = 'block';
    form.style.display = 'none';
    this.uploader.clearQueue();
  }

  subirFoto() {
    if (this.uploader.queue.length != 0) {
      if (confirm('¿Estás seguro de actualizar la foto del usuario?')) {
        this.uploader.queue[0].upload();
      }
    } else {
      this.tService.error(
        '',
        'Debe elegir un archivo para actualizar la foto.'
      );
    }
  }
}

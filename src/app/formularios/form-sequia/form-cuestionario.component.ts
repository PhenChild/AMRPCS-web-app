import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Cuestionario } from 'src/app/models/cuestionario';
import { Estacion } from 'src/app/models/estacion';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-form-cuestionario',
  templateUrl: './form-cuestionario.component.html',
  styleUrls: ['./form-cuestionario.component.scss'],
})
export class FormCuestionarioComponent implements OnInit {
  @Input() cuestionario!: Cuestionario;
  @Input() isAdmin!: boolean;
  @Input() isObserver!: boolean;
  @Input() isUpdating!: boolean;
  @Output() isDoneEvent = new EventEmitter<boolean>();

  estaciones: Estacion[] = [];
  idCuestionario!: number;
  public previewPath: any;

  /* Data for upload image */
  url!: string | ArrayBuffer | null;
  format!: string;

  uploader!: FileUploader;

  response!: string;

  isSuccess!: boolean;
  isCancel!: boolean;
  isError!: boolean;
  constructor(
    private dbService: DbService,
    private tService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.uploader = new FileUploader({
      url: dbService.dbURL + 'cuestionario/web/newPicture',
      method: 'POST',
      itemAlias: 'file',
      queueLimit: 4,
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

  ngOnInit(): void {
    if (this.isObserver && !this.isUpdating) {
      this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
        this.estaciones = data.map((item: any) => item.Estacion);
      });
    }
    this.cuestionario = new Cuestionario();

    this.isCancel = false;
    this.isError = false;
    this.isSuccess = false;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        id: this.idCuestionario,
        estacion: this.cuestionario.estacion,
      };
    };

    this.uploader.onCompleteAll = () => {
      const table = <HTMLInputElement>document.getElementById('perfil');
      const form = <HTMLInputElement>(
        document.getElementById('form-update-foto')
      );
      this.tService.success('Cuestionario enviado con éxito.', 'Envío exitoso');
      this.uploader.clearQueue();
      this.isDoneEvent.emit(true);
    };
  }

  saveCuestionario(form: NgForm) {
    if (form.valid) {
      if (this.isUpdating) {
      } else {
        if (confirm('¿Desea crear un nuevo cuestionario de sequía?')) {
          this.dbService.addCuestionario(this.cuestionario).subscribe(
            (data: any) => {
              this.idCuestionario = data.id;
              if (this.uploader.queue.length == 0) {
                this.tService.success(
                  'Cuestionario enviado con éxito.',
                  'Envío exitoso'
                );
                form.resetForm();
                this.isDoneEvent.emit(true);
              } else {
                this.uploader.uploadAll();
              }
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      }
    }
  }

  cancelar(form: NgForm) {
    form.resetForm();
    this.isDoneEvent.emit(false);
    this.uploader.clearQueue();
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }

  getPreview(item: any) {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(item._file)
    );
  }
}

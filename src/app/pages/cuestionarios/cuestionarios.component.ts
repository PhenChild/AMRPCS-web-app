import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Cuestionario } from 'src/app/models/cuestionario';
import { Estacion } from 'src/app/models/estacion';
import { Pais } from 'src/app/models/pais';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-cuestionarios',
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.scss'],
})
export class CuestionariosComponent implements OnInit {
  public location!: Location;
  isAdmin = false;
  isObserver = false;

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 7,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  cuestionarios: Cuestionario[] = [];
  paises: Pais[] = [];

  /** Lista de estaciones */
  estaciones: Estacion[] = [];

  /** Operador del datatable de los registros */
  dtTrigger: Subject<any> = new Subject<any>();

  filtro = {
    observador: '',
    estacion: '',
    fechaInicio: '',
    fechaFin: '',
    codEstacion: '',
    pais: '',
  };
  isDtInitialized: boolean = false;
  isUpdating: boolean = false;
  isForm: boolean = false;
  isTable: boolean = false;
  isData: boolean = false;

  cuestionario!: Cuestionario;
  idCuestionario!: number;

  /* Data for upload image */
  url!: string | ArrayBuffer | null;
  format!: string;

  uploader!: FileUploader;

  response!: string;

  isSuccess!: boolean;
  isCancel!: boolean;
  isError!: boolean;

  constructor(
    location: Location,
    private dbService: DbService,
    private tService: ToastrService,
    private router: ActivatedRoute
  ) {
    this.location = location;

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
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    titlee = titlee.split('/')[1];
    if (titlee === 'admin-layout') {
      this.isAdmin = true;
    } else if (titlee === 'obs-layout') {
      this.isObserver = true;
      this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
        this.estaciones = data.map((item: any) => item.Estacion);
      });
    }

    this.dbService.getPaises().subscribe((data: any) => {
      this.paises = data as any;
    });

    let estacion = this.router.snapshot.paramMap.get('estacion');
    let fi = this.router.snapshot.paramMap.get('fi');
    let ff = this.router.snapshot.paramMap.get('ff');

    if (!!estacion && !!fi && !!ff) {
      this.filtro.estacion = estacion;
      this.filtro.fechaInicio = Utils.date2(fi);
      this.filtro.fechaFin = Utils.date2(ff);
      this.getData();
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
      this.isForm = false;
      this.tService.success('Cuestionario enviado con éxito.', 'Envío exitoso');
      this.uploader.clearQueue();
    };

    /*this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log(response);
    };*/
  }

  getData(): void {
    const table = <HTMLInputElement>(
      document.getElementById('tablaCuestionarios')
    );
    table.style.display = 'none';
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getCuestionarios(this.filtro).subscribe((data: any) => {
      this.cuestionarios = data as any;
      this.isData = true;
      this.dtTrigger.next();
      const table = <HTMLInputElement>(
        document.getElementById('tablaCuestionarios')
      );
      table.style.display = 'block';
    });
  }

  saveValor() {
    /*if (confirm("¿Desea actualizar la información del reporte?")) {
      this.dbService.updateReporteValorAcumulado(this.reporte)
        .subscribe((data: any) => {
          this.tService.success("Valor actualizado con éxito", "Envío exitoso");
        }, (err: any) => {
          this.tService.error("", "Ha ocurrido un error");
        })
    }*/
  }

  saveCuestionario(form: NgForm) {
    if (form.valid) {
      if (confirm('¿Desea crear un nuevo cuestionario de sequía?')) {
        this.dbService.addCuestionario(this.cuestionario).subscribe(
          (data: any) => {
            this.idCuestionario = data.id;
            if (this.uploader.queue.length == 0) {
              this.isForm = false;
              this.tService.success(
                'Cuestionario enviado con éxito.',
                'Envío exitoso'
              );
              form.resetForm();
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

  deleteCuestionario(cuestionario: any): void {
    if (confirm('¿Está seguro de eliminar este cuestionario?')) {
      this.cuestionario = cuestionario;
      this.dbService.deleteCuestionario(this.cuestionario).subscribe(
        (data: any) => {
          this.tService.success(
            'Cuestionario eliminado con éxito.',
            'Envío exitoso'
          );
          this.getData();
        },
        (err: any) => {
          console.log(err);
          this.tService.error('', 'Ha ocurrido un error');
        }
      );
    }
  }

  activarCuestionario(cuestionario: any) {
    if (confirm('¿Está seguro de activar este cuestionario?')) {
      this.dbService.activateCuestionario(cuestionario).subscribe(
        (data: any) => {
          this.tService.success(
            'Cuestionario activado con éxito.',
            'Envío exitoso'
          );
          this.getData();
        },
        (err: any) => {
          this.tService.error('', 'Ha ocurrido un error');
        }
      );
    }
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }
  date(s: any) {
    return Utils.date(s);
  }
  downloadData() {
    const data = this.cuestionarios.map(function (cuestionario) {
      var obj = {
        codigo_estacion: cuestionario.Observador.Estacion.codigo,
        nombre_observador:
          cuestionario.Observador.User.nombre +
          ' ' +
          cuestionario.Observador.User.apellido,
        fecha_reporte: cuestionario.fecha,
        respSuelo: cuestionario.respSuelo,
        respVeg: cuestionario.respVeg,
        respPrec: cuestionario.respPrec,
        respTempPrec: cuestionario.respTempPrec,
        respTemps: cuestionario.respTemps,
        respGana: cuestionario.respGana,
        comentario: cuestionario.comentario
          ? cuestionario.comentario.replace('\n', '')
          : '',
      };
      return obj;
    });
    var titulo = 'Reportes de cuestionario de sequías';
    if (this.filtro.fechaInicio) {
      titulo += '| FILTRO: Fecha inicio: ' + this.filtro.fechaInicio;
    }
    if (this.filtro.fechaFin) {
      titulo += ' - Fecha Fin: ' + this.filtro.fechaFin;
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: titulo,
      useBom: true,
      headers: [
        'codigo_estacion',
        'nombre_observador',
        'fecha_reporte',
        'respSuelo',
        'respVeg',
        'respPrec',
        'respTempPrec',
        'respTemps',
        'respGana',
        'comentario',
      ],
      useHeader: true,
    };
    new AngularCsv(data, 'cuestionarios_de_sequia', options);
  }
}

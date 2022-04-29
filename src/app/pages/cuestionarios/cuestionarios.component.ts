import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  fechaActual!: Date;

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

  constructor(
    location: Location,
    private dbService: DbService,
    private tService: ToastrService,
    private router: ActivatedRoute
  ) {
    this.location = location;
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
    this.fechaActual = new Date();
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

  actualizar(cuestionario: Cuestionario): void {
    this.cuestionario = cuestionario;
    this.cuestionario.estacion = cuestionario.Observador.Estacion.id;
    this.isUpdating = true;
    this.isForm = true;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
  }

  nuevo(): void {
    this.isForm = true;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
  }

  formDone(event: any) {
    if (event) {
      this.getData();
    }
    this.isForm = false;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'block';
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

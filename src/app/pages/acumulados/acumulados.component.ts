import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { Estacion } from 'src/app/models/estacion';
import { ReporteAcumulado } from 'src/app/models/reporteAcumulado';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { NgForm } from '@angular/forms';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-acumulados',
  templateUrl: './acumulados.component.html',
  styleUrls: ['./acumulados.component.scss'],
})
export class AcumuladosComponent implements OnInit {
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
  reportes: ReporteAcumulado[] = [];
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
  isData: boolean = false;

  reporte!: ReporteAcumulado;

  constructor(
    location: Location,
    private dbService: DbService,
    private modal: NgbModal,
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
    this.reporte = new ReporteAcumulado();
    this.fechaActual = new Date();
  }

  getData(): void {
    const table = <HTMLInputElement>document.getElementById('tablaReportes');
    table.style.display = 'none';
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getReportesAcumulados(this.filtro).subscribe((data: any) => {
      this.reportes = data as any;
      this.isData = true;
      this.dtTrigger.next();
      const table = <HTMLInputElement>document.getElementById('tablaReportes');
      table.style.display = 'block';
    });
  }

  actualizar(reporte: ReporteAcumulado): void {
    this.reporte = reporte;
    this.isUpdating = true;
    this.reporte.estacion = reporte.Observador.Estacion.id.toString();
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
    this.isForm = true;
  }

  nuevo(): void {
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
    this.isForm = true;
  }

  formDone(event: any) {
    if (event) {
      this.getData();
    }
    this.isForm = false;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'block';
  }

  deleteReporte(reporte: any): void {
    if (confirm('¿Está seguro de eliminar este reporte?')) {
      this.reporte = reporte;
      this.dbService.deleteReporteAcumulado(this.reporte).subscribe(
        (data: any) => {
          this.tService.success(
            'Reporte eliminado con éxito.',
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

  activarReporte(reporte: any) {
    if (confirm('¿Está seguro de activar este reporte?')) {
      this.dbService.activateReporteAcumulado(reporte).subscribe(
        (data: any) => {
          this.tService.success('Reporte activado con éxito.', 'Envío exitoso');
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
    const data = this.reportes.map(function (reporte) {
      var obj = {
        codigo_estacion: reporte.Observador.Estacion.codigo,
        nombre_observador:
          reporte.Observador.User.nombre +
          ' ' +
          reporte.Observador.User.apellido,
        fecha_inicio_reporte: reporte.fechaInicio,
        fecha_fin_reporte: reporte.fechaFin,
        valor: reporte.valor,
        comentario: reporte.comentario
          ? reporte.comentario.replace('\n', '')
          : '',
      };
      return obj;
    });
    var titulo = 'Reportes de precipitación Acumulada';
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
        'fecha_inicio_reporte',
        'fecha_fin_reporte',
        'valor',
        'comentario',
      ],
      useHeader: true,
    };
    new AngularCsv(data, 'reportes_precipitacion_acumulada', options);
  }
}

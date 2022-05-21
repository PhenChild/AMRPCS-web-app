import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { Estacion } from 'src/app/models/estacion';
import { Reporte } from 'src/app/models/reporte';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public location!: Location;
  isAdmin = false;
  isObserver = false;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    responsive: true,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  reportes: Reporte[] = [];
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

  reporte!: Reporte;
  isDtInitialized: boolean = false;
  isUpdating: boolean = false;
  isForm: boolean = false;
  isData: boolean = false;

  constructor(
    location: Location,
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService,
    private router: ActivatedRoute,
    private routerA: Router
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
    this.reporte = new Reporte();
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

    this.dbService.getReportes(this.filtro).subscribe((data: any) => {
      this.reportes = data as any;
      this.isData = true;
      this.dtTrigger.next();
      const table = <HTMLInputElement>document.getElementById('tablaReportes');
      table.style.display = 'block';
    });
  }

  actualizar(reporte: Reporte): void {
    this.isForm = true;
    this.reporte = reporte;
    this.reporte.estacion = reporte.Observador.Estacion.id.toString();
    this.isUpdating = true;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
  }

  nuevo(): void {
    this.isForm = true;
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'none';
  }

  formDone(event: any) {
    this.isForm = false;
    if (event && this.isObserver) {
      this.routerA.navigate(['/obs-layout/mis-reportes']);
    }
    if (this.isDtInitialized) {
      this.getData();
    }
    const table = <HTMLInputElement>document.getElementById('table');
    table.style.display = 'block';
  }

  deleteReporte(reporte: any): void {
    if (confirm('¿Está seguro de eliminar este reporte?')) {
      this.reporte = reporte;
      this.dbService.deleteReporte(this.reporte).subscribe(
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
      this.dbService.activateReporte(reporte).subscribe(
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

  date(fecha: any) {
    return Utils.date(fecha);
  }

  downloadData() {
    const data = this.reportes.map(function (reporte) {
      let re1 = /.000Z/gi;
      let re2 = /T/gi;
      let f = reporte.fecha.replace(re1, '');

      var obj = {
        'Cód. Estación': reporte.Observador.Estacion.codigo,
        Observador:
          reporte.Observador.User.nombre +
          ' ' +
          reporte.Observador.User.apellido,
        Fecha: f.replace(re2, ' '),
        Valor: reporte.valor,
        Comentario: reporte.comentario
          ? reporte.comentario.replace('\n', '')
          : '',
      };
      return obj;
    });
    var titulo = 'Reportes de precipitación Diaria';
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
      headers: ['Cód. Estación', 'Observador', 'Fecha', 'Valor', 'Comentario'],
      useHeader: true,
    };
    new AngularCsv(data, 'reportes_precipitacion_diaria', options);
  }
}

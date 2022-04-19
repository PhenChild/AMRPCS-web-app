import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { Estacion } from 'src/app/models/estacion';
import { Reporte } from 'src/app/models/reporte';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { NgForm } from '@angular/forms';
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

  openModal(contenido: any, reporte: Reporte): void {
    this.reporte = reporte;
    this.modal.open(contenido, { size: 'lg' });
  }

  saveValor() {
    if (confirm('¿Desea actualizar la información del reporte?')) {
      this.dbService.updateReporteValor(this.reporte).subscribe(
        (data: any) => {
          this.tService.success('Valor actualizado con éxito', 'Envío exitoso');
          this.getData();
        },
        (err: any) => {
          this.tService.error('', 'Ha ocurrido un error');
        }
      );
    }
  }

  saveReporte(form: NgForm) {
    if (form.valid) {
      if (confirm('¿Desea crear un nuevo reporte?')) {
        this.dbService.addReporte(this.reporte).subscribe(
          (data: any) => {
            this.tService.success('Reporte creado con éxito', 'Envío exitoso');
            this.isForm = !this.isForm;
            form.resetForm();
          },
          (err: any) => {
            this.tService.error('', 'Ha ocurrido un error');
          }
        );
      }
    }
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
      var obj = {
        codigo_estacion: reporte.Observador.Estacion.codigo,
        nombre_observador:
          reporte.Observador.User.nombre +
          ' ' +
          reporte.Observador.User.apellido,
        fecha_reporte: reporte.fecha,
        valor: reporte.valor,
        comentario: reporte.comentario
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
      headers: [
        'codigo_estacion',
        'nombre_observador',
        'fecha_reporte',
        'valor',
        'comentario',
      ],
      useHeader: true,
    };
    new AngularCsv(data, 'reportes_precipitacion_diaria', options);
  }
}

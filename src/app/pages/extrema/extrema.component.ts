import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Estacion } from 'src/app/models/estacion';
import { Pais } from 'src/app/models/pais';
import { ReporteExtrema } from 'src/app/models/reporteExtrema';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-extrema',
  templateUrl: './extrema.component.html',
  styleUrls: ['./extrema.component.scss'],
})
export class ExtremaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public location!: Location;
  isAdmin = false;
  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    responsive: true,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  reportes: ReporteExtrema[] = [];
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

  reporte!: ReporteExtrema;
  isDtInitialized: boolean = false;
  isUpdating: boolean = false;
  isForm: boolean = false;

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
    }

    this.dbService.getPaises().subscribe((data: any) => {
      this.paises = data as any;
    });

    this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
      this.estaciones = data.map((item: any) => item.Estacion);
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
    this.reporte = new ReporteExtrema();
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

    this.dbService
      .getReportesPrecExtrema(this.filtro)
      .subscribe((data: any) => {
        console.log(data);
        this.reportes = data as any;
        this.dtTrigger.next();
        const table = <HTMLInputElement>(
          document.getElementById('tablaReportes')
        );
        table.style.display = 'block';
      });
  }

  saveValor() {
    if (confirm('¿Desea actualizar la información del reporte?')) {
      this.dbService.updatePrecipitacionExtrema(this.reporte).subscribe(
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
    if (confirm('¿Desea crear un nuevo reporte de precipitación extrema?')) {
      this.reporte.inundacion = this.reporte.inundacion ? 1 : 0;
      this.reporte.granizo = this.reporte.granizo ? 1 : 0;
      this.reporte.rayos = this.reporte.rayos ? 1 : 0;
      this.reporte.deslizamiento = this.reporte.deslizamiento ? 1 : 0;
      this.reporte.vientos = this.reporte.vientos ? 1 : 0;
      console.log(this.reporte);
      this.dbService.addPrecipitacionExtrema(this.reporte).subscribe(
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

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }
}

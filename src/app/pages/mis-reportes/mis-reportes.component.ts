import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Estacion } from 'src/app/models/estacion';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import { Reporte } from 'src/app/models/reporte';
import { ReporteAcumulado } from 'src/app/models/reporteAcumulado';
import { ReporteExtrema } from 'src/app/models/reporteExtrema';
import { Cuestionario } from 'src/app/models/cuestionario';

@Component({
  selector: 'app-mis-reportes',
  templateUrl: './mis-reportes.component.html',
  styleUrls: ['./mis-reportes.component.scss'],
})
export class MisReportesComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 7,
    responsive: true,
    searching: false,
  };

  /** Lista de estaciones */
  estaciones: Estacion[] = [];

  precipitaciones: Reporte[] = [];
  acumulados: ReporteAcumulado[] = [];
  extremas: ReporteExtrema[] = [];
  cuestionarios: Cuestionario[] = [];

  reporte!: Reporte;
  acumulado!: ReporteAcumulado;
  cuestionario!: Cuestionario;

  /** Operador del datatable de las estaciones */
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();
  dtTrigger4: Subject<any> = new Subject<any>();

  isUpdatingReporte: boolean = false;
  isUpdatingAcumulado: boolean = false;
  isUpdatingCuestionario: boolean = false;

  filtro = {
    estacion: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
  };

  isDtInitialized: boolean = false;

  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
      this.estaciones = data.map((item: any) => item.Estacion);
    });
  }

  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
    this.dtTrigger3.unsubscribe();
    this.dtTrigger4.unsubscribe();
  }

  getData(): void {
    const table1 = <HTMLInputElement>(
      document.getElementById('tablaPrecipitaciones')
    );
    const table2 = <HTMLInputElement>document.getElementById('tablaAcumulados');
    const table3 = <HTMLInputElement>document.getElementById('tablaExtremas');
    const table4 = <HTMLInputElement>(
      document.getElementById('tablaCuestionarios')
    );

    table1.style.display = 'none';
    table2.style.display = 'none';
    table3.style.display = 'none';
    table4.style.display = 'none';

    if (this.filtro.tipo == 'precipitacion') {
      this.dbService.getMisReportes(this.filtro).subscribe((data: any) => {
        this.precipitaciones = data as Reporte[];
        this.rerender();
        table1.style.display = 'block';
      });
    } else if (this.filtro.tipo == 'acumulado') {
      this.dbService.getMisReportes(this.filtro).subscribe((data: any) => {
        this.acumulados = data as ReporteAcumulado[];
        this.rerender();
        table2.style.display = 'block';
        //new AngularCsv(data, 'test');
      });
    } else if (this.filtro.tipo == 'extrema') {
      this.dbService.getMisReportes(this.filtro).subscribe((data: any) => {
        this.extremas = data as ReporteExtrema[];
        this.rerender();
        table3.style.display = 'block';
        //new AngularCsv(data, 'test');
      });
    } else if (this.filtro.tipo == 'cuestionario') {
      this.dbService.getMisReportes(this.filtro).subscribe((data: any) => {
        this.cuestionarios = data as Cuestionario[];
        this.rerender();
        table4.style.display = 'block';
        //new AngularCsv(data, 'test');
      });
    }
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }
  rerender() {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    this.dtTrigger1.next();
    this.dtTrigger2.next();
    this.dtTrigger3.next();
    this.dtTrigger4.next();
  }

  actualizarReporte(reporte: Reporte): void {
    this.reporte = reporte;
    this.isUpdatingReporte = true;
    this.reporte.estacion = reporte.Observador.Estacion.id.toString();
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-reporte');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  formReporteDone(event: any) {
    if (event) {
      this.getData();
    }
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-reporte');
    table.style.display = 'block';
    form.style.display = 'none';
  }

  actualizarAcumulado(reporte: ReporteAcumulado): void {
    this.acumulado = reporte;
    this.isUpdatingAcumulado = true;
    this.acumulado.estacion = reporte.Observador.Estacion.id.toString();
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-acumulado');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  formAcumuladoDone(event: any) {
    if (event) {
      this.getData();
    }
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-acumulado');
    table.style.display = 'block';
    form.style.display = 'none';
  }

  actualizarCuestionario(cuestionario: Cuestionario): void {
    this.cuestionario = cuestionario;
    this.isUpdatingCuestionario = true;
    this.cuestionario.estacion = cuestionario.Observador.Estacion.id;
    console.log(this.cuestionario);
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-cuestionario');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  formDoneCuestionario(event: any) {
    if (event) {
      this.getData();
    }
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-cuestionario');
    table.style.display = 'block';
    form.style.display = 'none';
  }
}

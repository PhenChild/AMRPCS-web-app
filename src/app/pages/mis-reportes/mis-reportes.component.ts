import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Estacion } from 'src/app/models/estacion';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-mis-reportes',
  templateUrl: './mis-reportes.component.html',
  styleUrls: ['./mis-reportes.component.scss']
})
export class MisReportesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 7,
    responsive: true,
    searching: false,
  };

  /** Lista de estaciones */
  estaciones: Estacion[] = [];

  /** Operador del datatable de las estaciones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;

  filtro = {
    estacion: "",
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
  }

  isDtInitialized: boolean = false

  constructor(
    private dbService: DbService,
    private tService: ToastrService
  ) { }

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
  }

  getData(): void {
    this.dbService
      .getMisReportes(this.filtro)
      .subscribe((data: any) => {
        console.log(data);
        //new AngularCsv(data, 'test');
      });
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }
}

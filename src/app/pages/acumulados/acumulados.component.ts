import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ReporteAcumulado } from 'src/app/models/reporteAcumulado';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-acumulados',
  templateUrl: './acumulados.component.html',
  styleUrls: ['./acumulados.component.scss']
})
export class AcumuladosComponent implements OnInit {



  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 7,
    responsive: true,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  reportes: ReporteAcumulado[] = [];

  /** Operador del datatable de los registros */
  dtTrigger: Subject<any> = new Subject<any>();

  filtro = {
    observador: "",
    estacion: "",
    fechaInicio: "",
    fechaFin: ""
  }
  isDtInitialized: boolean = false

  constructor(
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  getData(): void {
    const table = (<HTMLInputElement>document.getElementById("tablaReportes"));
    table.style.display = "none";
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
      })
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getReportesAcumulados(this.filtro)
      .subscribe((data: any) => {
        this.reportes = (data as any);
        console.log(this.reportes);
        this.dtTrigger.next();
        const table = (<HTMLInputElement>document.getElementById("tablaReportes"));
        table.style.display = "block";
      });


  }

  /**
     * Rectifica el formato de la fecha entregada por la base
     * @param s String de la fecha
     * @returns String de la fecha rectificada.
     */
  rectifyFormat(s: string) {
    const b = s.split(/\D/);
    return b[0] + "-" + b[1] + "-" + b[2] + "T" +
      b[3] + ":" + b[4] + ":" + b[5] + "." +
      b[6].substr(0, 3) + "+00:00";
  }
  /**
   * Obtiene la hora de la fecha rectificada.
   * @param s String de la fecha
   * @returns La hora de la fecha
   */
  time(s: any) {
    const fecha = new Date(this.rectifyFormat(s));
    return fecha.toTimeString().split(" ").slice(0, 1);
  }
  /**
   * Obtiene el dia de la fecha rectificada.
   * @param s Fecha entregada
   * @returns Dia de la fecha
   */
  date(s: any) {
    const fecha = this.rectifyFormat(s);
    return fecha.split("T")[0];
  }

}

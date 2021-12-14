import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Reporte } from 'src/app/models/reporte';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {



  /** ViewChild */
  @ViewChild(DataTableDirective)

  /** Datatable directive */
  datatableElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {};

  /** Lista de reportes seleccionados*/
  reportes: Reporte[] = [];

  /** Operador del datatable de los registros */
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5
    };
    this.dbService.getReportes()
      .subscribe((data: any) => {
        this.reportes = (data as any);
        console.log(this.reportes);
        this.dtTrigger.next(); this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            $("input", this.footer()).on("keyup change", function () {
              var input = <HTMLInputElement> this;
              if (dtInstance.column(this["id"]).search() !== input["value"]) {
                dtInstance
                  .column(this["id"])
                  .search(input["value"])
                  .draw();
              }
            });
          });
        });
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
time(s: any){
    const fecha = new Date(this.rectifyFormat(s));
    return fecha.toTimeString().split(" ").slice(0, 1);
}
/**
 * Obtiene el dia de la fecha rectificada.
 * @param s Fecha entregada
 * @returns Dia de la fecha
 */
date(s: any){
    const fecha = this.rectifyFormat(s);
    return fecha.split("T")[0];
}

}

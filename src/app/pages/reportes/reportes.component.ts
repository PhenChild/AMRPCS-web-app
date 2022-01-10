import { Location } from '@angular/common';
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



  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public location!: Location;
  isAdmin = false;
  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 10,
    responsive: true,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  reportes: Reporte[] = [];

  /** Operador del datatable de los registros */
  dtTrigger: Subject<any> = new Subject<any>();

  filtro = {
    observador: "",
    estacion: "",
    fechaInicio: "",
    fechaFin: ""
  }

  reporte!: Reporte;
  isDtInitialized: boolean = false

  constructor(
    location: Location,
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService
  ) {
    this.location = location;

  }

  ngOnInit(): void {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    titlee = titlee.split("/")[1]
    if (titlee === "admin-layout") {
      this.isAdmin = true;
    }
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

    this.dbService.getReportes(this.filtro)
      .subscribe((data: any) => {
        this.reportes = (data as any);
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

  openModal(contenido: any, reporte: Reporte): void {
    this.reporte = reporte;
    this.modal.open(contenido, { size: "lg" });
  }

  saveValor() {
    if (confirm("¿Desea actualizar la información del reporte?")) {
      this.dbService.updateReporteValor(this.reporte)
        .subscribe((data: any) => {
          this.tService.success("Valor actualizado con exito", "Envio exitoso");
        }, (err: any) => {
          this.tService.error("", "Ha ocurrido un error");
        })
    }
  }

}

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Reporte } from 'src/app/models/reporte';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

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
    fechaFin: "",
    codEstacion: ""
  }

  reporte!: Reporte;
  isDtInitialized: boolean = false

  constructor(
    location: Location,
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService,
    private router: ActivatedRoute,
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

    let estacion = this.router.snapshot.paramMap.get('estacion')
    let fi = this.router.snapshot.paramMap.get('fi')
    let ff = this.router.snapshot.paramMap.get('ff')

    if (!!estacion && !!fi && !!ff) {
      this.filtro.estacion = estacion;
      this.filtro.fechaInicio = Utils.date2(fi);
      this.filtro.fechaFin = Utils.date2(ff)
      this.getData();
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

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }

}

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { ReporteAcumulado } from 'src/app/models/reporteAcumulado';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-acumulados',
  templateUrl: './acumulados.component.html',
  styleUrls: ['./acumulados.component.scss']
})
export class AcumuladosComponent implements OnInit {


  public location!: Location;
  isAdmin = false;

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 7,
    searching: false,
  };

  /** Lista de reportes seleccionados*/
  reportes: ReporteAcumulado[] = [];
  paises: Pais[] = [];

  /** Operador del datatable de los registros */
  dtTrigger: Subject<any> = new Subject<any>();

  filtro = {
    observador: "",
    estacion: "",
    fechaInicio: "",
    fechaFin: "",
    codEstacion: "",
    pais: ""
  }
  isDtInitialized: boolean = false

  reporte!: ReporteAcumulado;


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

    this.dbService.getPaises()
      .subscribe((data: any) => {
        this.paises = (data as any);
      });

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

    this.dbService.getReportesAcumulados(this.filtro)
      .subscribe((data: any) => {
        console.log(data);
        this.reportes = (data as any);
        this.dtTrigger.next();
        const table = (<HTMLInputElement>document.getElementById("tablaReportes"));
        table.style.display = "block";
      });


  }

  openModal(contenido: any, reporte: ReporteAcumulado): void {
    this.reporte = reporte;
    this.modal.open(contenido, { size: "lg" });
  }

  saveValor() {
    if (confirm("¿Desea actualizar la información del reporte?")) {
      this.dbService.updateReporteValorAcumulado(this.reporte)
        .subscribe((data: any) => {
          this.tService.success("Valor actualizado con éxito", "Envío exitoso");
        }, (err: any) => {
          this.tService.error("", "Ha ocurrido un error");
        })
    }
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }
  date(s: any) {
    return Utils.date(s);
  }

}

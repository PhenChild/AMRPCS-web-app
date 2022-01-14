import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 7,
    responsive: true,
    searching: false,
  };
  /** Lista de paises */
  paises: Pais[] = [];

  /** pais */
  pais = new Pais();

  /** Operador del datatable de las estaciones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;

  filtro = {
    nombre: "",
    siglas: "",
  }
  isDtInitialized: boolean = false

  constructor(
    private dbService: DbService,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {
  }


  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
  }

  getData(): void {
    const table = (<HTMLInputElement>document.getElementById("tablaPaises"));
    table.style.display = "none";
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
      })
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getFiltroPaises(this.filtro)
      .subscribe((data: any) => {
        this.paises = (data as any);
        this.dtTrigger1.next();
        const table = (<HTMLInputElement>document.getElementById("tablaPaises"));
        table.style.display = "block";
      });

  }

  /**
  * Editar una estación
  * @param estacion estacion a editar
  */
  editarPais(pais: any): void {
    this.pais = pais;
    this.isUpdating = true;
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-pais"));
    table.style.display = "none";
    form.style.display = "block";
  }

  /**
  * Editar una estación
  * @param estacion estacion a editar
  */
  nuevoPais(): void {
    this.pais = new Pais();
    this.isUpdating = false;
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-pais"));
    table.style.display = "none";
    form.style.display = "block";
  }

  /**
     * Eliminar una estación
     * @param estacion estación que será eliminada
     */
  deletePais(pais: any): void {
    if (confirm("¿Está seguro de eliminar este país?")) {
      this.pais = pais;
      this.dbService.deletePais(this.pais).subscribe((data: any) => {
        this.tService.success("Pais eliminada con éxito.", "Envio exitoso");
        this.getData();
      },
        (err: any) => {
          this.tService.error("", "Ha ocurrido un error");
        });
    }
  }

  /**
     * Envio de actualización de estación
     * @param formPais formulario de estación
     */
  submit(formPais: NgForm): void {
    if (formPais.valid) {
      if (this.isUpdating) {
        if (confirm("¿Está seguro de actualizar la información de este país?")) {
          this.dbService.updatePais(this.pais)
            .subscribe(
              (data: any) => {
                this.tService.success("Pais actualizado con éxito.", "Envio exitoso");
                formPais.reset();
                const table = (<HTMLInputElement>document.getElementById("table"));
                const form = (<HTMLInputElement>document.getElementById("form-pais"));
                table.style.display = "block";
                form.style.display = "none";
                this.getData();
              },
              (err: any) => {
                this.tService.error("", "Ha ocurrido un error");
              }
            );
        }
      } else {
        if (confirm("¿Está seguro de crear un nuevo país?")) {
          this.dbService.addPais(this.pais)
            .subscribe(
              (data: any) => {
                this.tService.success("Pais creado con éxito.", "Envio exitoso");
                formPais.reset();
                const table = (<HTMLInputElement>document.getElementById("table"));
                const form = (<HTMLInputElement>document.getElementById("form-pais"));
                table.style.display = "block";
                form.style.display = "none";
                this.getData();
              },
              (err: any) => {
                this.tService.error("", "Ha ocurrido un error");
              }
            );
        }
      }
    }
  }

  /**
   * Cancelar la actualización
   * @param formPais formulario de actualización
   */
  cancelar(formPais: NgForm): void {
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-pais"));
    table.style.display = "block";
    form.style.display = "none";
    this.pais = new Pais();
    formPais.reset();
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }

  activar(pais: any) {
    if (confirm("¿Está seguro de activar este país?")) {
      this.dbService.activatePais(pais).subscribe((data: any) => {
        this.tService.success("País activado con éxito.", "Envio exitoso");
      }, (err: any) => {
        this.tService.error("", "Ha ocurrido un error");
      })
    }
  }

}

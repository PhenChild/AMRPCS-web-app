import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pais } from 'src/app/models/pais';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit, OnDestroy {


  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {};

  /** Lista de paises */
  paises: Pais[] = [];

  /** pais */
  pais = new Pais();

  /** Operador del datatable de las estaciones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;

  constructor(
    private dbService: DbService,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 7
    };
    this.dbService.getPaises()
      .subscribe((data: any) => {
        this.paises = (data as any);
        console.log(this.paises);
        this.dtTrigger1.next();
      });

  }


  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
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
    this.pais = pais;
    this.dbService.deletePais(this.pais).subscribe((data: any) => {
      this.tService.success("Pais eliminada con exito.", "Envio exitoso");
      window.location.reload();
    },
      (err: any) => {
        console.log(err);
        this.tService.error("", "Ha ocurrido un error");
      });
  }

  /**
     * Envio de actualización de estación
     * @param formPais formulario de estación
     */
  submit(formPais: NgForm): void {
    if (this.isUpdating) {
      this.dbService.updatePais(this.pais)
        .subscribe(
          (data: any) => {
            this.tService.success("Pais actualizado con exito.", "Envio exitoso");
            formPais.reset();
            const table = (<HTMLInputElement>document.getElementById("table"));
            const form = (<HTMLInputElement>document.getElementById("form-pais"));
            table.style.display = "block";
            form.style.display = "none";
            window.location.reload();
          },
          (err: any) => {
            console.log(err);
            this.tService.error("", "Ha ocurrido un error");
          }
        );
    } else {
      this.dbService.addPais(this.pais)
        .subscribe(
          (data: any) => {
            this.tService.success("Pais creado con exito.", "Envio exitoso");
            formPais.reset();
            const table = (<HTMLInputElement>document.getElementById("table"));
            const form = (<HTMLInputElement>document.getElementById("form-pais"));
            table.style.display = "block";
            form.style.display = "none";
            window.location.reload();
          },
          (err: any) => {
            console.log(err);
            this.tService.error("", "Ha ocurrido un error");
          }
        );
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



}

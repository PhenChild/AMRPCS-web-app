import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Division } from 'src/app/models/division';
import { Pais } from 'src/app/models/pais';
import { DbService } from 'src/app/services/database/db.service';

@Component({
  selector: 'app-divisiones',
  templateUrl: './divisiones.component.html',
  styleUrls: ['./divisiones.component.scss']
})
export class DivisionesComponent implements OnInit {

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {};

  /** Lista de divisiones */
  divisiones: Division[] = [];

  paises: Pais[] = [];

  divisionesSuperiores: Division[] = [];

  /** Division */
  division = new Division();

  /** Operador del datatable de las divisiones */
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
    this.dbService.getDivisiones()
      .subscribe((data: any) => {
        this.divisiones = (data as any);
        console.log(this.divisiones);
        this.dtTrigger1.next();
      },
        (err: any) => {
          console.log(err)
        });
  }

  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
  }

  /**
  * Editar una division
  * @param division division a editar
  */
  editarDivision(division: any): void {
    this.dbService.getPaises()
      .subscribe((data: any) => {
        this.paises = (data as any);
        console.log(this.paises);
      });
    this.division = division;
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-division"));
    table.style.display = "none";
    form.style.display = "block";
  }

  /**
  * Crear una division
  */
  nuevaDivision(): void {

    this.dbService.getPaises()
      .subscribe((data: any) => {
        this.paises = (data as any);
        console.log(this.paises);
      });

    this.division = new Division();
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-division"));
    table.style.display = "none";
    form.style.display = "block";
  }

  /**
     * Eliminar una estación
     * @param estacion estación que será eliminada
     */
  deleteDivision(division: any): void {
    this.division = division;
    this.dbService.deleteDivision(this.division).subscribe((data: any) => {
      this.tService.success("División eliminada con exito.", "Envio exitoso");
      window.location.reload();
    },
      (err: any) => {
        console.log(err);
        this.tService.error("", "Ha ocurrido un error");
      });
  }

  /**
     * Envio de actualización de división
     * @param formDivision formulario de división
     */
  submit(formDivision: NgForm): void {
    if (this.isUpdating) {
      this.dbService.updateDivision(this.division)
        .subscribe(
          (data: any) => {
            this.tService.success("División actualizada con exito.", "Envio exitoso");
            formDivision.reset();
            const table = (<HTMLInputElement>document.getElementById("table"));
            const form = (<HTMLInputElement>document.getElementById("form-division"));
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
      this.dbService.addDivision(this.division)
        .subscribe(
          (data: any) => {
            this.tService.success("División creada con exito.", "Envio exitoso");
            formDivision.reset();
            const table = (<HTMLInputElement>document.getElementById("table"));
            const form = (<HTMLInputElement>document.getElementById("form-division"));
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

  getDivisionesSuperiores() {
    if (!!this.division.idPais && !!this.division.nivel && this.division.nivel > 1) {
      console.log(this.division.nivel)
      console.log(this.division)
      this.dbService.getDivisionesSuperiores(this.division.idPais, this.division.nivel)
        .subscribe((data: any) => {
          console.log(this.divisionesSuperiores);
          this.divisionesSuperiores = (data as any);
        });
    }
  }

  /**
   * Cancelar la actualización
   * @param formDivision formulario de actualización
   */
  cancelar(formDivision: NgForm): void {
    const table = (<HTMLInputElement>document.getElementById("table"));
    const form = (<HTMLInputElement>document.getElementById("form-division"));
    table.style.display = "block";
    form.style.display = "none";
    this.division = new Division();
    formDivision.reset();
  }

}

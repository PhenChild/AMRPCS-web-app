import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
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

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    pageLength: 7,
    responsive: true,
    searching: false,
  };

  /** Lista de divisiones */
  divisiones: Division[] = [];

  paises: Pais[] = [];

  divisionesSuperiores: Division[] = [];

  /** Division */
  division = new Division();

  /** Operador del datatable de las divisiones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;


  filtro = {
    nombre: "",
    pais: "",
    nivel: "",
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
    const table = (<HTMLInputElement>document.getElementById("tablaDivisiones"));
    table.style.display = "none";
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy()
      })
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getFiltroDivisiones(this.filtro)
      .subscribe((data: any) => {
        this.divisiones = (data as any);
        console.log(this.divisiones);
        this.dtTrigger1.next();
        const table = (<HTMLInputElement>document.getElementById("tablaDivisiones"));
        table.style.display = "block";
      });
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
    this.isUpdating = true;
    
    this.getDivisionesSuperiores()
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
    if (confirm("¿Está seguro de eliminar esta division política?")) {
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
  }

  /**
     * Envio de actualización de división
     * @param formDivision formulario de división
     */
  submit(formDivision: NgForm): void {
    if (this.isUpdating) {
      if (confirm("¿Está seguro de actualizar la información de esta division política?")) {
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
      }
    } else {
      if (confirm("¿Está seguro de crear una nueva division política?")) {
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

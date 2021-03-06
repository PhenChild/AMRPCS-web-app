import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Division } from 'src/app/models/division';
import { Pais } from 'src/app/models/pais';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-divisiones',
  templateUrl: './divisiones.component.html',
  styleUrls: ['./divisiones.component.scss'],
})
export class DivisionesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 7,
    responsive: true,
    searching: false,
  };

  /** Lista de divisiones */
  divisiones: Division[] = [];

  paises: Pais[] = [];
  filtroPaises: Pais[] = [];

  divisionesSuperiores: Division[] = [];

  /** Division */
  division = new Division();

  /** Operador del datatable de las divisiones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;

  filtro = {
    nombre: '',
    pais: '',
    nivel: '',
  };

  isDtInitialized: boolean = false;

  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    this.dbService.getPaises().subscribe((data: any) => {
      this.filtroPaises = data as any;
    });
  }

  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
  }

  getData(): void {
    const table = <HTMLInputElement>document.getElementById('tablaDivisiones');
    table.style.display = 'none';
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getFiltroDivisiones(this.filtro).subscribe((data: any) => {
      this.divisiones = data as any;
      this.dtTrigger1.next();
      const table = <HTMLInputElement>(
        document.getElementById('tablaDivisiones')
      );
      table.style.display = 'block';
    });
  }

  /**
   * Editar una division
   * @param division division a editar
   */
  editarDivision(division: any): void {
    this.dbService.getPaises().subscribe((data: any) => {
      this.paises = data as any;
      this.division = division;
      this.isUpdating = true;

      this.getDivisionesSuperiores();
    });
  }

  /**
   * Crear una division
   */
  nuevaDivision(): void {
    this.dbService.getPaises().subscribe((data: any) => {
      this.paises = data as any;
    });
    this.division = new Division();
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-division');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  /**
   * Eliminar una estación
   * @param estacion estación que será eliminada
   */
  deleteDivision(division: any): void {
    if (confirm('¿Está seguro de eliminar esta división política?')) {
      this.division = division;
      this.dbService.deleteDivision(this.division).subscribe(
        (data: any) => {
          this.tService.success(
            'División eliminada con éxito.',
            'Envío exitoso'
          );
          this.getData();
        },
        (err: any) => {
          this.tService.error('', 'Ha ocurrido un error');
        }
      );
    }
  }

  /**
   * Envío de actualización de división
   * @param formDivision formulario de división
   */
  submit(formDivision: NgForm): void {
    if (this.isUpdating) {
      if (formDivision.valid) {
        if (
          confirm(
            '¿Está seguro de actualizar la información de esta división política?'
          )
        ) {
          this.dbService.updateDivision(this.division).subscribe(
            (data: any) => {
              this.tService.success(
                'División actualizada con éxito.',
                'Envío exitoso'
              );
              formDivision.reset();
              const table = <HTMLInputElement>document.getElementById('table');
              const form = <HTMLInputElement>(
                document.getElementById('form-division')
              );
              table.style.display = 'block';
              form.style.display = 'none';
              this.paises = [];
              this.divisionesSuperiores = [];
              this.getData();
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      }
    } else {
      if (formDivision.valid) {
        if (confirm('¿Está seguro de crear una nueva división política?')) {
          this.dbService.addDivision(this.division).subscribe(
            (data: any) => {
              this.tService.success(
                'División creada con éxito.',
                'Envío exitoso'
              );
              formDivision.reset();
              const table = <HTMLInputElement>document.getElementById('table');
              const form = <HTMLInputElement>(
                document.getElementById('form-division')
              );
              table.style.display = 'block';
              form.style.display = 'none';
              this.paises = [];
              this.divisionesSuperiores = [];
              this.getData();
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      }
    }
  }

  getDivisionesSuperiores() {
    if (
      !!this.division.idPais &&
      !!this.division.nivel &&
      this.division.nivel > 1
    ) {
      this.dbService
        .getDivisionesSuperiores(this.division.idPais, this.division.nivel)
        .subscribe((data: any) => {
          this.divisionesSuperiores = data as any;
          const table = <HTMLInputElement>document.getElementById('table');
          const form = <HTMLInputElement>(
            document.getElementById('form-division')
          );
          table.style.display = 'none';
          form.style.display = 'block';
        });
    } else {
      const table = <HTMLInputElement>document.getElementById('table');
      const form = <HTMLInputElement>document.getElementById('form-division');
      table.style.display = 'none';
      form.style.display = 'block';
    }
  }

  /**
   * Cancelar la actualización
   * @param formDivision formulario de actualización
   */
  cancelar(formDivision: NgForm): void {
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-division');
    table.style.display = 'block';
    form.style.display = 'none';
    this.paises = [];
    this.divisionesSuperiores = [];
    this.division = new Division();
    formDivision.reset();
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }
  activar(division: any) {
    if (confirm('¿Está seguro de activar esta división?')) {
      this.dbService.activateDivision(division).subscribe(
        (data: any) => {
          this.tService.success(
            'División activada con éxito.',
            'Envío exitoso'
          );
          this.getData();
        },
        (err: any) => {
          if (err.status == 418) {
            this.tService.error(
              'La división pertenece a una división superior inactiva.',
              'Error'
            );
          } else {
            this.tService.error('', 'Ha ocurrido un error');
          }
        }
      );
    }
  }
}

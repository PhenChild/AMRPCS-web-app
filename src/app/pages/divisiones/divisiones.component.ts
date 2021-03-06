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
   * Eliminar una estaci??n
   * @param estacion estaci??n que ser?? eliminada
   */
  deleteDivision(division: any): void {
    if (confirm('??Est?? seguro de eliminar esta divisi??n pol??tica?')) {
      this.division = division;
      this.dbService.deleteDivision(this.division).subscribe(
        (data: any) => {
          this.tService.success(
            'Divisi??n eliminada con ??xito.',
            'Env??o exitoso'
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
   * Env??o de actualizaci??n de divisi??n
   * @param formDivision formulario de divisi??n
   */
  submit(formDivision: NgForm): void {
    if (this.isUpdating) {
      if (formDivision.valid) {
        if (
          confirm(
            '??Est?? seguro de actualizar la informaci??n de esta divisi??n pol??tica?'
          )
        ) {
          this.dbService.updateDivision(this.division).subscribe(
            (data: any) => {
              this.tService.success(
                'Divisi??n actualizada con ??xito.',
                'Env??o exitoso'
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
        if (confirm('??Est?? seguro de crear una nueva divisi??n pol??tica?')) {
          this.dbService.addDivision(this.division).subscribe(
            (data: any) => {
              this.tService.success(
                'Divisi??n creada con ??xito.',
                'Env??o exitoso'
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
   * Cancelar la actualizaci??n
   * @param formDivision formulario de actualizaci??n
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
    if (confirm('??Est?? seguro de activar esta divisi??n?')) {
      this.dbService.activateDivision(division).subscribe(
        (data: any) => {
          this.tService.success(
            'Divisi??n activada con ??xito.',
            'Env??o exitoso'
          );
          this.getData();
        },
        (err: any) => {
          if (err.status == 418) {
            this.tService.error(
              'La divisi??n pertenece a una divisi??n superior inactiva.',
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

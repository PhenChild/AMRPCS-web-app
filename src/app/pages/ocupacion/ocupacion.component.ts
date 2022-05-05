import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Ocupacion } from 'src/app/models/ocupacion';
import { Sector } from 'src/app/models/sector';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-ocupacion',
  templateUrl: './ocupacion.component.html',
  styleUrls: ['./ocupacion.component.scss'],
})
export class OcupacionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 7,
    responsive: true,
    searching: false,
  };
  /** Lista de ocupaciones */
  ocupaciones: Ocupacion[] = [];
  sectores: Sector[] = [];

  /** ocupacion */
  ocupacion = new Ocupacion();

  /** Operador del datatable de las ocupaciones */
  dtTrigger1: Subject<any> = new Subject<any>();

  isUpdating: boolean = false;

  filtro = {
    descripcion: '',
    sector: '',
  };

  isDtInitialized: boolean = false;
  isForm: boolean = false;
  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    this.dbService.getSectores().subscribe((data: any) => {
      this.sectores = data;
    });
  }

  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
  }

  getData(): void {
    const table = <HTMLInputElement>document.getElementById('tablaOcupaciones');
    table.style.display = 'none';
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    } else {
      this.isDtInitialized = true;
    }

    this.dbService.getFiltroOcupaciones(this.filtro).subscribe((data: any) => {
      this.ocupaciones = data as any;
      this.dtTrigger1.next();
      const table = <HTMLInputElement>(
        document.getElementById('tablaOcupaciones')
      );
      table.style.display = 'block';
    });
  }

  /**
   * Editar una ocupacion
   * @param ocupacion ocupacion a editar
   */
  editarOcupacion(ocupacion: any): void {
    this.ocupacion = ocupacion;
    this.ocupacion.sector = ocupacion.Sector.id;
    this.isUpdating = true;
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-ocupacion');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  /**
   * Editar una ocupacion
   * @param ocupacion ocupacion a editar
   */
  nuevaOcupacion(): void {
    this.ocupacion = new Ocupacion();
    this.isUpdating = false;
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-ocupacion');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  /**
   * Eliminar una estación
   * @param estacion estación que será eliminada
   */
  deleteOcupacion(ocupacion: any): void {
    if (confirm('¿Está seguro de eliminar esta ocupación?')) {
      this.ocupacion = ocupacion;
      this.dbService.deleteOcupacion(this.ocupacion).subscribe(
        (data: any) => {
          this.tService.success(
            'Ocupación eliminada con éxito.',
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
   * Envío de actualización de ocupacion
   * @param formOcupacion formulario de ocupacion
   */
  submit(formOcupacion: NgForm): void {
    if (formOcupacion.valid) {
      if (this.isUpdating) {
        if (
          confirm(
            '¿Está seguro de actualizar la información de esta ocupación?'
          )
        ) {
          this.dbService.updateOcupacion(this.ocupacion).subscribe(
            (data: any) => {
              this.tService.success(
                'Ocupación actualizada con éxito.',
                'Envío exitoso'
              );
              formOcupacion.reset();
              const table = <HTMLInputElement>document.getElementById('table');
              const form = <HTMLInputElement>(
                document.getElementById('form-ocupacion')
              );
              table.style.display = 'block';
              form.style.display = 'none';
              this.getData();
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      } else {
        if (confirm('¿Está seguro de crear una nueva ocupación?')) {
          this.dbService.addOcupacion(this.ocupacion).subscribe(
            (data: any) => {
              this.tService.success(
                'Ocupación creada con éxito.',
                'Envío exitoso'
              );
              formOcupacion.reset();
              const table = <HTMLInputElement>document.getElementById('table');
              const form = <HTMLInputElement>(
                document.getElementById('form-ocupacion')
              );
              table.style.display = 'block';
              form.style.display = 'none';
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

  /**
   * Cancelar la actualización
   * @param formOcupacion formulario de actualización
   */
  cancelar(formOcupacion: NgForm): void {
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-ocupacion');
    table.style.display = 'block';
    form.style.display = 'none';
    this.ocupacion = new Ocupacion();
    formOcupacion.reset();
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }

  activar(ocupacion: any) {
    if (confirm('¿Está seguro de activar esta ocupacion?')) {
      this.dbService.activateOcupacion(ocupacion).subscribe(
        (data: any) => {
          this.tService.success(
            'Ocupación activada con éxito.',
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
}

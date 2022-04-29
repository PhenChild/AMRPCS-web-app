import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Estacion } from 'src/app/models/estacion';
import { Reporte } from 'src/app/models/reporte';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-form-reporte',
  templateUrl: './form-reporte.component.html',
  styleUrls: ['./form-reporte.component.scss'],
})
export class FormReporteComponent implements OnInit {
  @Input() reporte!: Reporte;
  @Input() isAdmin!: boolean;
  @Input() isObserver!: boolean;
  @Input() isUpdating!: boolean;
  @Output() isDoneEvent = new EventEmitter<boolean>();

  estaciones: Estacion[] = [];
  maxDate: any = moment(new Date()).format('yyyy-MM-DD');

  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    if (this.isObserver && !this.isUpdating) {
      this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
        this.estaciones = data.map((item: any) => item.Estacion);
      });
    }
    if (!this.isUpdating) {
      this.reporte = new Reporte();
    }
  }

  saveReporte(form: NgForm) {
    if (form.valid) {
      if (this.isUpdating) {
        if (confirm('¿Desea actualizar la información del reporte?')) {
          this.dbService.updateReporteValor(this.reporte).subscribe(
            (data: any) => {
              this.tService.success(
                'Valor actualizado con éxito',
                'Envío exitoso'
              );
              form.resetForm();
              this.isDoneEvent.emit(true);
            },
            (err: any) => {
              this.tService.error('', 'Ha ocurrido un error');
            }
          );
        }
      } else {
        const fecha = new Date(this.reporte.fecha);
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const puedeReportar =
          ((horas == 4 && minutos >= 30) || horas > 4) && horas < 10;
        if (puedeReportar) {
          if (confirm('¿Desea crear un nuevo reporte?')) {
            this.dbService.addReporte(this.reporte).subscribe(
              (data: any) => {
                this.tService.success(
                  'Reporte creado con éxito',
                  'Envío exitoso'
                );
                form.resetForm();
                this.isDoneEvent.emit(true);
              },
              (err: any) => {
                this.tService.error('', 'Ha ocurrido un error');
              }
            );
          }
        } else {
          this.tService.error(
            'Disponible entre las 4h30 y 10h00',
            'Horario no disponible'
          );
        }
      }
    }
  }

  cancelar(form: NgForm) {
    form.resetForm();
    this.isDoneEvent.emit(false);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }
}

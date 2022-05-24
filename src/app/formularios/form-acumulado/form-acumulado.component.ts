import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Estacion } from 'src/app/models/estacion';
import { ReporteAcumulado } from 'src/app/models/reporteAcumulado';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-form-acumulado',
  templateUrl: './form-acumulado.component.html',
  styleUrls: ['./form-acumulado.component.scss'],
})
export class FormAcumuladoComponent implements OnInit {
  @Input() reporte!: ReporteAcumulado;
  @Input() isAdmin!: boolean;
  @Input() isObserver!: boolean;
  @Input() isUpdating!: boolean;
  @Output() isDoneEvent = new EventEmitter<boolean>();

  estaciones: Estacion[] = [];
  minDate: any = moment(new Date().setDate(new Date().getDate() - 5)).format(
    'yyyy-MM-DD'
  );
  maxDate: any = moment(new Date().setDate(new Date().getDate() - 1)).format(
    'yyyy-MM-DD'
  );
  maxDateTime: any = moment(new Date().setHours(23)).format(
    'yyyy-MM-DDTHH:mm:ss'
  );

  isTraza: boolean = false;
  isDesborde: boolean = false;

  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    if (this.isObserver && !this.isUpdating) {
      this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
        this.estaciones = data.map((item: any) => item.Estacion);
      });
    }
    if (!this.isUpdating) {
      this.reporte = new ReporteAcumulado();
      this.reporte.fechaFin = moment(new Date()).format('yyyy-MM-DD');
    }
  }

  saveReporte(form: NgForm) {
    if (form.valid) {
      if (this.isUpdating) {
        if (confirm('¿Desea actualizar la información del reporte?')) {
          this.dbService.updateReporteValorAcumulado(this.reporte).subscribe(
            (data: any) => {
              this.tService.success(
                'Reporte actualizado con éxito',
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
        const fecha = new Date(this.reporte.fechaFin);
        const fechaInicio = new Date(this.reporte.fechaInicio);
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const puedeReportar =
          ((horas == 4 && minutos >= 30) || horas > 4) && horas < 10;
        const diferenciaDias = moment(fecha).diff(moment(fechaInicio), 'days');
        console.log(diferenciaDias);
        if (!puedeReportar) {
          this.tService.error(
            'Disponible entre las 4h30 y 10h00',
            'Horario de Fecha Final no disponible'
          );
        } else if (diferenciaDias > 5) {
          this.tService.error(
            'Entre Fecha Inicio y Fecha Fin debe existir máximo una diferencia de 5 días',
            ''
          );
        } else {
          if (confirm('¿Desea enviar este nuevo reporte acumulado?')) {
            this.dbService.addReporteAcumulado(this.reporte).subscribe(
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

  checkValor() {
    if (this.isUpdating) {
      if (this.reporte.valor == -888) {
        this.isTraza = true;
      } else if (this.reporte.valor == -777) {
        this.isDesborde = true;
      }
    }
  }
  traza() {
    this.checkValor();
    this.isTraza = !this.isTraza;
    if (this.isTraza) {
      this.reporte.valor = -888;
    } else {
      delete this.reporte['valor'];
    }
  }

  desborde() {
    this.checkValor();
    this.isDesborde = !this.isDesborde;
    if (this.isDesborde) {
      this.reporte.valor = -777;
    } else {
      delete this.reporte['valor'];
    }
  }
  setDecimals() {
    let valor = parseFloat(this.reporte.valor?.toFixed(1)!);
    if (!isNaN(valor)) {
      this.reporte.valor = parseFloat(this.reporte.valor?.toFixed(1)!);
    } else {
      this.tService.error('', 'Ingresar un valor con formato válido');
    }
  }
}

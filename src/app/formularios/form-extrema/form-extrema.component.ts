import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Estacion } from 'src/app/models/estacion';
import { ReporteExtrema } from 'src/app/models/reporteExtrema';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import moment from 'moment';

@Component({
  selector: 'app-form-extrema',
  templateUrl: './form-extrema.component.html',
  styleUrls: ['./form-extrema.component.scss'],
})
export class FormExtremaComponent implements OnInit {
  @Input() reporte!: ReporteExtrema;
  @Input() isAdmin!: boolean;
  @Input() isObserver!: boolean;
  @Input() isUpdating!: boolean;
  @Output() isDoneEvent = new EventEmitter<boolean>();

  estaciones: Estacion[] = [];

  constructor(private dbService: DbService, private tService: ToastrService) {}

  ngOnInit(): void {
    if (this.isObserver && !this.isUpdating) {
      this.dbService.getEstacionesSelfUsuario().subscribe((data: any) => {
        this.estaciones = data.map((item: any) => item.Estacion);
      });
    }
    if (!this.isUpdating) {
      this.reporte = new ReporteExtrema();
      this.reporte.fecha = moment(new Date()).format('yyyy-MM-DDTHH:mm');
    }
  }

  saveReporte(form: NgForm) {
    if (form.valid) {
      if (this.isUpdating) {
        if (confirm('¿Desea actualizar la información del reporte?')) {
          this.reporte.inundacion = this.reporte.inundacion ? 1 : 0;
          this.reporte.granizo = this.reporte.granizo ? 1 : 0;
          this.reporte.rayos = this.reporte.rayos ? 1 : 0;
          this.reporte.deslizamiento = this.reporte.deslizamiento ? 1 : 0;
          this.reporte.vientos = this.reporte.vientos ? 1 : 0;
          this.dbService.updatePrecipitacionExtrema(this.reporte).subscribe(
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
        if (
          confirm('¿Desea enviar este nuevo reporte de precipitación extrema?')
        ) {
          this.reporte.inundacion = this.reporte.inundacion ? 1 : 0;
          this.reporte.granizo = this.reporte.granizo ? 1 : 0;
          this.reporte.rayos = this.reporte.rayos ? 1 : 0;
          this.reporte.deslizamiento = this.reporte.deslizamiento ? 1 : 0;
          this.reporte.vientos = this.reporte.vientos ? 1 : 0;
          this.dbService.addPrecipitacionExtrema(this.reporte).subscribe(
            (data: any) => {
              this.tService.success(
                'Reporte creado con éxito',
                'Envío exitoso'
              );
              form.resetForm();
              this.isDoneEvent.emit(true);
            },
            (err: any) => {
              console.log(err);
              this.tService.error('', 'Ha ocurrido un error');
            }
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ToastrService } from 'ngx-toastr';
import { DbService } from 'src/app/services/database/db.service';
import Utils from 'src/app/utils/utils';
import 'chartjs-adapter-moment';
import { NgForm } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss'],
})
export class GraficosComponent implements OnInit {
  filtro = {
    observador: '',
    estacion: '',
    fechaInicio: '',
    fechaFin: '',
  };
  myChart!: Chart;
  isDrawn = false;

  reportes = [];

  constructor(
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let estacion = this.router.snapshot.paramMap.get('estacion');
    let fi = this.router.snapshot.paramMap.get('fi');
    let ff = this.router.snapshot.paramMap.get('ff');
    if (!!estacion && !!fi && !!ff) {
      this.filtro.estacion = estacion;
      this.filtro.fechaInicio = Utils.date2(fi);
      this.filtro.fechaFin = Utils.date2(ff);
      this.getData();
    }
  }

  getDataForm(formChart: NgForm) {
    if (formChart.valid) {
      this.getData();
    }
  }

  getData(): void {
    if (this.isDrawn) {
      this.myChart.destroy();
    }
    let fi = new Date(this.filtro.fechaInicio);
    let ff = new Date(this.filtro.fechaFin);
    if (fi <= ff) {
      this.dbService.getReportesGraficos(this.filtro).subscribe(
        (data: any) => {
          this.reportes = data as any;
          const fechas = this.reportes.map((a: any) => Utils.date(a.fecha));
          const valores = this.reportes.map((a: any) => {
            if (a.valor == -888) {
              return 0;
            } else if (a.valor == -1) {
              return null;
            } else {
              return a.valor;
            }
          });
          this.myChart = new Chart('chart', {
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
              labels: fechas,
              datasets: [
                {
                  label: 'Precipitacion',
                  backgroundColor: ['#93B5C6'],
                  data: valores,
                  datalabels: {
                    color: '#232323',
                    formatter: function (value, context) {
                      if (value == null) return 'x';
                      else return value;
                    },
                    anchor: 'center',
                  },
                },
              ],
            },
            options: {
              indexAxis: 'x',
              locale: 'es',
              responsive: true,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    tooltipFormat: 'DD-MM-YYYY',
                    displayFormats: {
                      day: 'DD-MM-YYYY',
                    },
                  },
                },

                y: {
                  display: true,
                  ticks: {},
                },
              },
              plugins: {
                title: {
                  display: true,
                  text:
                    'Mostrando datos de: ' +
                    this.filtro.estacion +
                    ' desde ' +
                    this.filtro.fechaInicio +
                    ' hasta ' +
                    this.filtro.fechaFin,
                },
              },
            },
          });
          this.isDrawn = true;
        },
        (err: any) => {
          if (err.status == 418) {
            this.tService.error(
              'El nombre o código de estación ingresado no existe.',
              'Error'
            );
          }
        }
      );
    } else {
      this.tService.error(
        'La fecha de inicio debe ser menor o igual a la fecha de fin.',
        'Error'
      );
    }
  }
}

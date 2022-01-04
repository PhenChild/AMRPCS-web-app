import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DbService } from 'src/app/services/database/db.service';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit {

  filtro = {
    observador: "",
    estacion: "",
    fechaInicio: "",
    fechaFin: ""
  }
  myChart!: Chart;



  reportes = [];

  constructor(
    private dbService: DbService,
    private modal: NgbModal,
    private tService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  getData(): void {
    this.dbService.getReportesGraficos(this.filtro)
      .subscribe((data: any) => {
        this.reportes = (data as any);
        console.log(this.reportes);
        const fechas = this.reportes.map((a:any) => a.fecha)
        const valores = this.reportes.map((a:any) => {
          if(a.valor == 0){
            return 0.01
          }else if(a.valor == -888){
            return 0
          }else{
            return a.valor
          }
        })
        this.myChart = new Chart("chart", {
          type: "bar",
          data: {
            labels: fechas,
            datasets: [{
              label: "Precipitacion",
              backgroundColor: ["#FF8000"],
              data: valores,
            }]
          },
          options: {
            indexAxis:'y',
            responsive: true,
          }
        });
      });
  }

}

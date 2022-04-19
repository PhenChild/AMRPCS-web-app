import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormReporteComponent } from './form-reporte/form-reporte.component';
import { FormsModule } from '@angular/forms';
import { FormExtremaComponent } from './form-extrema/form-extrema.component';
import { FormCuestionarioComponent } from './form-sequia/form-cuestionario.component';
import { FormAcumuladoComponent } from './form-acumulado/form-acumulado.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [CommonModule, FormsModule, FileUploadModule],
  declarations: [
    FormReporteComponent,
    FormAcumuladoComponent,
    FormExtremaComponent,
    FormCuestionarioComponent,
  ],
  exports: [
    FormReporteComponent,
    FormAcumuladoComponent,
    FormExtremaComponent,
    FormCuestionarioComponent,
  ],
})
export class FormulariosModule {}

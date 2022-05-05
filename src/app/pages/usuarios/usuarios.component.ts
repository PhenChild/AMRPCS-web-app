import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { DbService } from '../../services/database/db.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { DataTableDirective } from 'angular-datatables';
import { Pais } from 'src/app/models/pais';
import { FileUploader } from 'ng2-file-upload';
import { Estacion } from 'src/app/models/estacion';
import { Location } from '@angular/common';
import Utils from 'src/app/utils/utils';
import { data } from 'jquery';
import { Ocupacion } from 'src/app/models/ocupacion';
import { Sector } from 'src/app/models/sector';

/**
 * Componente para la pagina de usuarios.
 */
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsuariosComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  dtElements!: QueryList<DataTableDirective>;

  /** Opciones para los datatbles. */
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    responsive: true,
    searching: false,
  };

  /* Data for upload image */
  url!: string | ArrayBuffer | null;
  format!: string;

  uploader!: FileUploader;

  response!: string;

  isSuccess!: boolean;
  isCancel!: boolean;
  isError!: boolean;
  isOcupaciones = false;

  /** Lista de usuarios*/
  usuarios: User[] = [];

  /** Usuario seleccionado */
  usuario = new User();
  paises: Pais[] = [];
  ocupaciones: Ocupacion[] = [];
  sectores: Sector[] = [];
  sector = new Sector();
  confpassword = '';

  /** Operador del datatable de los usuarios */
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();

  isDtInitialized: boolean = false;
  isDtInitialized2: boolean = false;

  filtro = {
    nombre: '',
    email: '',
    rol: '',
    pais: '',
  };

  filtroEstacion = {
    nombre: '',
    codigo: '',
    pais: '',
  };

  public location!: Location;
  isAdmin = false;
  isObserver = false;

  estaciones: Estacion[] = [];

  selectedEstaciones: Estacion[] = [];
  addedEstaciones: Estacion[] = [];
  deletedEstaciones: Estacion[] = [];
  filtroPaises: Pais[] = [];

  /**
   * Constructor
   * @param dbService
   * @param tService
   */
  constructor(
    location: Location,
    private dbService: DbService,
    private tService: ToastrService
  ) {
    this.location = location;

    this.uploader = new FileUploader({
      url: dbService.dbURL + 'users/updatePicture',
      method: 'POST',
      itemAlias: 'file',
      queueLimit: 1,
      headers: [
        {
          name: 'x-access-token',
          value: sessionStorage.getItem('token')!,
        },
      ],
    });

    this.response = '';

    this.uploader.response.subscribe((res) => (this.response = res));
  }

  /**
   * Obtencion de los usuarios desde la base de datos
   */
  ngOnInit(): void {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    titlee = titlee.split('/')[1];
    if (titlee === 'admin-layout') {
      this.isAdmin = true;
      this.dbService.getSectores().subscribe((data: any) => {
        this.sectores = data as any;
      });
    } else if (titlee === 'obs-layout') {
      this.isObserver = true;
    }
    this.isCancel = false;
    this.isError = false;
    this.isSuccess = false;

    this.dbService.getPaises().subscribe((data: any) => {
      this.filtroPaises = data as any;
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onBeforeUploadItem = (item: any) => {
      this.uploader.options.additionalParameter = {
        id: this.usuario.id,
      };
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      const table = <HTMLInputElement>document.getElementById('table');
      const form = <HTMLInputElement>(
        document.getElementById('form-update-foto')
      );
      table.style.display = 'block';
      form.style.display = 'none';
      this.tService.success('Foto actualizada con exito.', 'Envío exitoso');
      this.uploader.clearQueue();
    };
  }

  /**
   * Elimina los operadores de los datatables
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  tableEstacion() {
    const table = <HTMLInputElement>document.getElementById('form-estacion');
    if (this.usuario.role == 'observer') {
      table.style.display = 'block';
    } else {
      table.style.display = 'none';
    }
  }

  getOcupaciones(sector: any) {
    this.dbService.getOcupacionesbySector(sector).subscribe((data: any) => {
      this.usuario.idOcupacion = -1;
      this.ocupaciones = data as any;
      this.isOcupaciones = true;
    });
  }
  getData(): void {
    const table = <HTMLInputElement>document.getElementById('tablaUsuarios');
    table.style.display = 'none';
    if (this.isDtInitialized) {
      this.dtElements.forEach((dtElement: DataTableDirective) => {
        if (dtElement.dtInstance)
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
      });
    } else {
      this.isDtInitialized = true;
    }
    this.dbService.getUsuarios(this.filtro).subscribe((data: User[]) => {
      this.usuarios = data;
      this.dtTrigger.next();
      const table = <HTMLInputElement>document.getElementById('tablaUsuarios');
      table.style.display = 'block';
    });
  }

  getDataEstaciones(): void {
    const table = <HTMLInputElement>document.getElementById('tablaEstaciones');
    table.style.display = 'none';
    if (this.isDtInitialized2) {
      this.dtElements.forEach((dtElement: DataTableDirective) => {
        if (dtElement.dtInstance)
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
          });
      });
    } else {
      this.isDtInitialized2 = true;
    }

    this.dbService
      .getEstacionesParaUsuario(this.filtroEstacion)
      .subscribe((data: any) => {
        this.estaciones = data as any;
        this.dtTrigger1.next();
        const table = <HTMLInputElement>(
          document.getElementById('tablaEstaciones')
        );
        table.style.display = 'block';
      });
  }

  /**
   * Edición de usuarios
   * @param usuario usuario con datos para la actualizacion del usuario
   */
  editarUsuario(usuario: any): void {
    this.dbService.getPaises().subscribe((data: any) => {
      this.paises = data as any;
    });
    this.dbService.getEstacionesUsuario(usuario).subscribe((data: any[]) => {
      this.selectedEstaciones = data.map((a) => a.Estacion);
    });
    this.usuario = usuario;
    if (usuario.Ocupacion) {
      this.sector = usuario.Ocupacion.Sector.id;
      this.dbService
        .getOcupacionesbySector(this.sector)
        .subscribe((data: any) => {
          this.ocupaciones = data as any;
          this.isOcupaciones = true;
        });
    }
    this.usuario.password = '';
    const form2 = document.getElementById('formUsuario');
    const tableE = <HTMLInputElement>document.getElementById('form-estacion');
    if (usuario.role == 'observer') {
      tableE.style.display = 'block';
    } else {
      tableE.style.display = 'none';
    }
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-usuario');
    table.style.display = 'none';
    form.style.display = 'block';
  }

  editarPassword(usuario: any): void {
    this.usuario = usuario;
    this.usuario.password = '';
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>(
      document.getElementById('form-update-password')
    );
    table.style.display = 'none';
    form.style.display = 'block';
  }

  /**
   * Eliminación de usuarios
   * @param usuario usuario a eliminar
   */
  deleteUsuario(usuario: any): void {
    this.usuario = usuario;
    if (confirm('¿Está seguro de eliminar el usuario?')) {
      this.dbService.deleteUsuario(this.usuario).subscribe(
        (data: any) => {
          this.tService.success(
            'Usuario eliminado con éxito.',
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
   * Guardado de la actualización de un usuario
   * @param formUsuario formulario de usuario
   */
  submit(formUsuario: NgForm): void {
    if (
      formUsuario.valid &&
      this.usuario.idOcupacion &&
      this.usuario.idOcupacion != -1
    ) {
      if (
        this.usuario.role == 'observer' &&
        this.selectedEstaciones.length == 0
      ) {
        this.tService.error(
          '',
          'Debe seleccionar al menos una estación para el observador.'
        );
      } else {
        if (
          formUsuario.valid &&
          confirm('¿Está seguro de actualizar la información del usuario?')
        ) {
          this.dbService
            .updateUsuario(
              this.usuario,
              this.addedEstaciones,
              this.deletedEstaciones
            )
            .subscribe(
              (data: any) => {
                const table = <HTMLInputElement>(
                  document.getElementById('table')
                );
                const form = <HTMLInputElement>(
                  document.getElementById('form-usuario')
                );
                table.style.display = 'block';
                form.style.display = 'none';
                this.usuario = new User();
                this.tService.success(
                  'Usuario actualizado con exito.',
                  'Envío exitoso'
                );
                formUsuario.reset();
                this.getData();
              },
              (err: any) => {
                this.tService.error('', 'Ha ocurrido un error');
                this.addedEstaciones = [];
                this.deletedEstaciones = [];
                this.selectedEstaciones = [];
                formUsuario.reset();
              }
            );
        }
      }
    }
  }

  /**
   * Cancelar la actualización
   * @param formUser formulario de usuario
   */
  cancelar(formUser: NgForm): void {
    this.paises = [];
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-usuario');
    table.style.display = 'block';
    form.style.display = 'none';
    this.usuario = new User();
    formUser.reset();
  }

  submitPassword(formPasswordUsuario: NgForm): void {
    if (!formPasswordUsuario.valid) {
      this.tService.error('', 'Debe llenar todos los campos');
    } else if (this.confpassword != this.usuario.password) {
      this.tService.error('', 'Las contraseñas deben coincidir');
    } else {
      if (confirm('¿Está seguro de actualizar la contraseña del usuario?')) {
        this.dbService.updateUserPassword(this.usuario).subscribe(
          (data: any) => {
            const table = <HTMLInputElement>document.getElementById('table');
            const form = <HTMLInputElement>(
              document.getElementById('form-update-password')
            );
            table.style.display = 'block';
            form.style.display = 'none';
            this.tService.success(
              'Contraseña actualizada con exito.',
              'Envío exitoso'
            );
            formPasswordUsuario.reset();
            this.getData();
          },
          (err: any) => {
            this.tService.error('', 'Ha ocurrido un error');
            formPasswordUsuario.reset();
          }
        );
      }
    }
  }

  cancelarPassword(formPasswordUsuario: NgForm): void {
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>(
      document.getElementById('form-update-password')
    );
    table.style.display = 'block';
    form.style.display = 'none';
    this.usuario = new User();
    formPasswordUsuario.reset();
  }

  editarFoto(usuario: User): void {
    this.usuario = usuario;
    this.dbService.getFoto(this.usuario).subscribe(
      (data: any) => {
        this.usuario.foto = data.foto;
        const table = <HTMLInputElement>document.getElementById('table');
        const form = <HTMLInputElement>(
          document.getElementById('form-update-foto')
        );
        table.style.display = 'none';
        form.style.display = 'block';
      },
      (err: any) => {
        const table = <HTMLInputElement>document.getElementById('table');
        const form = <HTMLInputElement>(
          document.getElementById('form-update-foto')
        );
        table.style.display = 'none';
        form.style.display = 'block';
      }
    );
  }

  subirFoto() {
    if (this.uploader.queue.length != 0) {
      if (confirm('¿Estás seguro de actualizar la foto del usuario?')) {
        this.uploader.queue[0].upload();
      }
    } else {
      this.tService.error(
        '',
        'Debe elegir un archivo para actualizar la foto.'
      );
    }
  }

  cancelarFoto(): void {
    const table = <HTMLInputElement>document.getElementById('table');
    const form = <HTMLInputElement>document.getElementById('form-update-foto');
    table.style.display = 'block';
    form.style.display = 'none';
    this.usuario = new User();
    this.uploader.clearQueue();
  }

  /**
   * Selecciona una estación a la que pertenecer el nuevo observador.
   * @param estacion Estacion escojida.
   */
  selectEstacion(estacion: Estacion): void {
    if (
      !this.selectedEstaciones.some((e) => e.id == estacion.id) &&
      !this.deletedEstaciones.some((e) => e.id == estacion.id)
    ) {
      this.selectedEstaciones.push(estacion);
      this.addedEstaciones.push(estacion);
    } else if (
      !this.selectedEstaciones.some((e) => e.id == estacion.id) &&
      this.deletedEstaciones.some((e) => e.id == estacion.id)
    ) {
      this.selectedEstaciones.push(estacion);
      this.deletedEstaciones = this.deletedEstaciones.filter(
        (obj) => obj !== estacion
      );
    }
  }

  /**
   * Deselecciona una estacion, para seleccionar otra para el observador.
   */
  unselectEstacion(estacion: Estacion): void {
    this.selectedEstaciones = this.selectedEstaciones.filter(
      (obj) => obj !== estacion
    );
    if (
      !this.deletedEstaciones.includes(estacion) &&
      !this.addedEstaciones.includes(estacion)
    ) {
      this.deletedEstaciones.push(estacion);
    } else if (
      !this.deletedEstaciones.includes(estacion) &&
      this.addedEstaciones.includes(estacion)
    ) {
      this.addedEstaciones = this.addedEstaciones.filter(
        (obj) => obj !== estacion
      );
    }
  }

  time(fecha: any) {
    return Utils.time(fecha);
  }

  date(fecha: any) {
    return Utils.date(fecha);
  }

  activar(usuario: any) {
    if (confirm('¿Está seguro de activar este usuario?')) {
      this.dbService.activateUser(usuario).subscribe(
        (data: any) => {
          this.tService.success('Usuario activado con exito.', 'Envío exitoso');
        },
        (err: any) => {
          this.tService.error('', 'Ha ocurrido un error');
        }
      );
    }
    this.getData();
  }
}

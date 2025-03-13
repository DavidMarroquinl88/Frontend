import { EventEmitter, Injectable } from '@angular/core';
import { Mensaje, TipoMensaje } from '../models/Mensaje';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageCustomService {

  public mensajeRecibido: EventEmitter<Mensaje> = new EventEmitter();

  constructor() {

  }


  showApiErrorServer(error : any, tiempo?: number) {
    this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR, error.error.Error, 'Error', undefined, tiempo));
  }

  showApiError(error : string) {
    this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR, error, 'Error', undefined));
  }

  showApiWarning(error : string) {
    this.mensajeRecibido.emit(new Mensaje(TipoMensaje.WARNING, error, 'Validar', undefined));
  }

  showApiSucess(error : string) {
    this.mensajeRecibido.emit(new Mensaje(TipoMensaje.SUCCESS, error, 'Éxito', undefined));
  }

  showApiErrorMessage(message: HttpErrorResponse, tiempo?: number) {
    this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR, message!.headers!.get('errorMsg')!, 'Error', undefined, tiempo));
  }

  showApiErrorAlertMessage(error : any, tiempo?: number) {
    if (error.header) {
      this.showApiErrorMessage(error, tiempo);
    } else {
      this.mensajeRecibido.emit(new Mensaje(TipoMensaje.WARNING, error.message, 'Advertencia', undefined, tiempo));
    }
  }

  showApiMessage(mensaje: Mensaje) {
    this.mensajeRecibido.emit(mensaje);
  }

  showApiMessageType(tipo: number, mensaje: string, titulo?: string, tiempo?: number) {
    this.mensajeRecibido.emit(new Mensaje(tipo, mensaje, titulo, undefined, tiempo));
  }

  onValidarErrorService(error : any, tiempo?: number) {
    if (error.status === 0) {
      this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR,
        'Error desconocido, vuelva intentarlo nuevamente por favor.', 'Error', undefined, tiempo));
    }
    if (error.header) {
      this.showApiErrorMessage(error, tiempo);
    } else if (error.error != null && error.error.message) {
      this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR, error.error.message, 'Error', undefined, tiempo));
    } else if (error.error) {
      this.showApiErrorServer(error, tiempo);
    } else {
      this.mensajeRecibido.emit(new Mensaje(TipoMensaje.ERROR, 'Error de comunicación con el servidor de negocio.', 'Error', undefined, tiempo));
    }
  }

}

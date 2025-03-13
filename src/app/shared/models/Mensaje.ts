import { Subject } from "rxjs";

export class Mensaje {
  constructor(tipo = TipoMensaje.SUCCESS, texto = '', titulo = '',
              confirmObservable = new Subject<boolean>(),
              tiempo?: number) {
    this.tipo = tipo;
    this.texto = texto;
    this.titulo = titulo;
    this.confirmObservable = confirmObservable;
    this.tiempo = tiempo || 9000;
  }

  tipo: TipoMensaje;
  texto: string | undefined;
  titulo: string | undefined;
  tiempo: number | undefined;
  confirmObservable: Subject<boolean> | undefined;
  onClose: (() => any) | undefined;
}

export enum TipoMensaje {
  ERROR = 0,
  WARNING = 1,
  SUCCESS = 2,
  CONFIRM = 3,
  ACEPTAR = 4,
  INFO = 5,
  ERRORREACTIVO = 6,
  SUCCESSREACTIVO = 7,
  WARNINGREACTIVO = 8,
  INFOREACTIVO = 9
}

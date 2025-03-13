import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { MessageCustomService } from '../../services/message.service';
import { TipoMensaje } from '../../models/TipoMensaje';
import { timer as observableTimer } from 'rxjs';
import swal from 'sweetalert2'
import { Message } from 'primeng/message';
import { PrimengCommonModule } from '../../modules/primeng-common.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-components-control-alert',
  imports: [PrimengCommonModule, CommonModule],
  providers: [MessageService],
  templateUrl: './control-alert.component.html',
  styleUrl: './control-alert.component.css'
})
export class ControlAlertComponent implements OnInit, OnDestroy {

  @Input() titulo: string = "";

  @Input() mensaje: string = "";
  @Input() tipo: string = "warning";
  @Input() onClose: (() => any) | undefined;
  display = false;
  public confirmObservable: Subject<boolean> | undefined;
  successMsgs: Message[] = [];
  timer: any;

  constructor(
    public msgCustomService: MessageCustomService,
    public msgService: MessageService
  ) {

  }

  ngOnInit() {

    this.msgCustomService.mensajeRecibido.subscribe(alerta => {

      console.log("entró a mostrar el componente de messages");

      this.titulo = alerta.titulo!;
      this.mensaje = alerta.texto!;

      this.onClose = alerta.onClose;

      switch (alerta.tipo) {
        case TipoMensaje.ERROR:
          this.mostrarError();
          this.timer = observableTimer(alerta.tiempo!);
          let subsError = this.timer.subscribe(() => {
            this.successMsgs = [];
            subsError.unsubscribe();
            this.timer = null;
          });
          break;
        case TipoMensaje.SUCCESS:
          this.mostrarExito();
          this.timer = observableTimer(alerta.tiempo!);
          let subs = this.timer.subscribe(() => {
            this.successMsgs = [];
            subs.unsubscribe();
            this.timer = null;
          });

          break;
        case TipoMensaje.WARNING:
          this.mostrarWarning();
          this.timer = observableTimer(alerta.tiempo!);
          let subsWarning = this.timer.subscribe(() => {
            this.successMsgs = [];
            subsWarning.unsubscribe();
            this.timer = null;
          });
          break;
        case TipoMensaje.INFO:
          this.mostrarInfo();
          this.timer = observableTimer(alerta.tiempo!);
          let subsInfo = this.timer.subscribe(() => {
            this.successMsgs = [];
            subsInfo.unsubscribe();
            this.timer = null;
          });
          break;
        case TipoMensaje.ERRORREACTIVO:
          this.mostrarErrorReactivo();
          break;
        case TipoMensaje.SUCCESSREACTIVO:
          this.confirmObservable = alerta.confirmObservable;
          this.mostrarSuccesReactivo();
          break;
        case TipoMensaje.WARNINGREACTIVO:
          this.mostrarWarningReactivo();
          break;
        case TipoMensaje.INFOREACTIVO:
          this.mostrarInfoReactivo();
          break;
        case TipoMensaje.ACEPTAR:
          this.confirmObservable = alerta.confirmObservable;
          this.mostrarAceptar();
          break;
        case TipoMensaje.CONFIRM:
          this.confirmObservable = alerta.confirmObservable;
          this.display = true;
          break;
      }
    });
  }

  confirmar() {
    this.display = false;
    this.confirmObservable!.next(true);
  }

  cancelar() {
    this.display = false;
    this.confirmObservable!.next(false);
  }

  ngOnDestroy(): void {
    this.msgCustomService.mensajeRecibido.unsubscribe();
  }

  mostrarError() {
    this.msgService.add({ key: 'myGrowl', severity: 'error', summary: this.titulo, detail: this.mensaje });
  }

  mostrarExito() {
    this.msgService.add({ key: 'myGrowl', severity: 'success', summary: this.titulo, detail: this.mensaje });
  }

  mostrarWarning() {
    this.msgService.add({ key: 'myGrowl', severity: 'warn', summary: this.titulo, detail: this.mensaje });
  }

  mostrarInfo() {
    this.msgService.add({ key: 'myGrowl', severity: 'info', summary: this.titulo, detail: this.mensaje });
  }

  mostrarErrorReactivo() {
    swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'error',
      willClose: this.onClose
    });
  }

  mostrarSuccesReactivo() {
    swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'success',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      timer: 20000,
      willClose: this.onClose
    }).then(result => {
      this.confirmObservable!.next(<boolean>result.value)
    });;

  }
  mostrarWarningReactivo() {
    swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'warning',
      willClose: this.onClose
    });
  }


  mostrarInfoReactivo() {
    swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'info',
      willClose: this.onClose
    });
  }

  mostrarAceptar() {
    swal.fire({
      title: this.titulo,
      text: this.mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      this.confirmObservable!.next(<boolean>result.value)
    });
  };

}

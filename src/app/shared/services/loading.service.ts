import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  public ControlLoadingEvent: EventEmitter<boolean> = new EventEmitter();


  constructor() { }

  public Show() : void {
    this.ControlLoadingEvent.emit(true);
  }

  public Hide() : void{
    this.ControlLoadingEvent.emit(false);
  }

}

import { Component, OnInit, ElementRef } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { PrimengCommonModule } from '../../modules/primeng-common.module';

@Component({
  selector: 'shared-components-control-loading',
  imports:[PrimengCommonModule],
  templateUrl: './control-loading.component.html',
  styleUrl: './control-loading.component.css'
})
export class ControlLoadingComponent implements OnInit  {

  public showLoading : boolean = false;

  constructor(
    private loading : LoadingService
  ){


  }

  ngOnInit(): void {
    this.loading.ControlLoadingEvent.subscribe(element => {

      if(element)
          this.showLoading = true;
        else
          this.showLoading = false;
    })
  }


}

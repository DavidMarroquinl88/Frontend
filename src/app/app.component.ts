import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlAlertComponent } from './shared/components/control-alert/control-alert.component';
import { MessageCustomService } from './shared/services/message.service';
import { ControlLoadingComponent } from './shared/components/control-loading/control-loading.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ControlAlertComponent, ControlLoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


}

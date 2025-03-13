import { MessageCustomService } from './../../../shared/services/message.service';
import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlAlertComponent } from '../../../shared/components/control-alert/control-alert.component';
import { Router } from '@angular/router';
import { AuthenticationApiClient, AuthRequest } from '../../../shared/services/http.services';
import { lastValueFrom } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';


@Component({
  selector: 'authentication-login',
  imports: [PrimengCommonModule, ReactiveFormsModule, ControlValidatorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  frmControls: FormGroup | undefined = undefined;

  constructor(
    private frmBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private router: Router,
    private authenticationService: AuthenticationApiClient,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.frmControls = this.frmBuilder.group(
      {
        'user': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200), Validators.email] }],
        'password': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }]
      }
    );
  }

  async onSendLogin() {
    if (this.frmControls?.invalid) {
      this.frmControls.markAllAsTouched();
      this.messageService.showApiWarning("Verifica que la información sea correcta");
      return;
    }

    this.loadingService.Show();

    let result = await lastValueFrom(this.authenticationService.login(new AuthRequest(
      {
        email: this.frmControls!.controls['user'].value,
        password: this.frmControls!.controls['password'].value
      }
    )));


    if (result)
      if (result.isSuccess == false) {
        this.loadingService.Hide();
        this.messageService.showApiWarning(result.messageError!);
        return;
      }


    if (!result || !result.token || !result.id) {
      this.loadingService.Hide();
      this.messageService.showApiWarning("Error al ingresar credenciales");
      return;
    }

    this.router.navigate(['pages/store']);

    this.loadingService.Hide();
  }

}

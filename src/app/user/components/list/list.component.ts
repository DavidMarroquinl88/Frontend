import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { Subject } from 'rxjs';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'user-components-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, ControlValidatorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup | undefined = undefined;
  items: UserModel[] = [];
  itemSelect: UserModel | undefined = undefined;
  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService
  ) { }

  ngOnInit(): void {
    this.frmControls = this.formBuilder.group({
      'firstName': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(500)] }],
      'lastName': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(500)] }],
      'address': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
      'email': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(500)] }],
      'password': [null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(500)] }],
    });

    this.items = [
      new UserModel(1,'David','Marroquín López','Colonia Ignacio Rámirez','davidmarroquínl88@gmail.com','d5m9l5_d5m9l5'),
      new UserModel(2,'David','Marroquín López','Colonia Ignacio Rámirez','davidmarroquínl88@gmail.com','d5m9l5_d5m9l5'),
      new UserModel(3,'David','Marroquín López','Colonia Ignacio Rámirez','davidmarroquínl88@gmail.com','d5m9l5_d5m9l5'),
      new UserModel(4,'David','Marroquín López','Colonia Ignacio Rámirez','davidmarroquínl88@gmail.com','d5m9l5_d5m9l5'),
    ]
  }

  onShowAddItem() {
    this.frmControls?.reset();
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Usuario";
  }

  onShowEditItem(item: UserModel) {
    this.frmControls?.reset();
    this.SetItemToFormGroup(item);
    this.typeCommand = "Editar";
    this.titleModal = "Editar Usuario";
    this.showModal = true;
  }

  onDeleteItem(element: UserModel) {

    this.typeCommand = "Eliminar";
    this.itemSelect = element;
    let resultOperation: Subject<boolean> = new Subject();

    this.messageService.showApiMessage(new Mensaje(
      TipoMensaje.CONFIRM,
      "¿Desea eliminar el registro?",
      "Confirmar Operación",
      resultOperation
    ));

    resultOperation.subscribe(result => {
      if (result) {
        this.deleteItem();
        this.messageService.showApiSucess("El Registro se ha eliminado correctamente");
      }
    })

  }

  onClear() {
    this.frmControls?.reset();
  }

  onSave() {
    if (this.typeCommand === "Agregar") {
      this.processItem();
    }

    if (this.typeCommand === "Editar") {
      this.processItem();
    }
  }

  processItem() {
    if (this.frmControls?.invalid) {
      this.frmControls.markAllAsTouched();
      this.messageService.showApiWarning("Verifica que la información sea correcta");
      return;
    }

    let element = this.GetItemFromFormGroup();
    if (this.typeCommand === 'Editar') {
      element.id = this.itemSelect?.id;
      this.itemSelect!.firstName = element.firstName;
      this.itemSelect!.lastName = element.lastName;
      this.itemSelect!.address = element.address;
      this.itemSelect!.email = element.email;
      this.itemSelect!.password = element.password;

      this.messageService.showApiSucess("El Registro se ha editado correctamente");
    }

    if (this.typeCommand === 'Agregar') {
      this.items.push(element);
      this.messageService.showApiSucess("El Registro se ha creado correctamente");

    }
    this.showModal = false;
  }

  deleteItem() {
    console.log(this.itemSelect?.id);
    this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
  }

  private GetItemFromFormGroup(): UserModel {
    let firstName: string = this.frmControls!.controls['firstName'].value;
    let lastName: string = this.frmControls!.controls['lastName'].value;
    let address: string = this.frmControls!.controls['address'].value;
    let email: string = this.frmControls!.controls['email'].value;
    let password: string = this.frmControls!.controls['password'].value;

    return new UserModel(1, firstName, lastName, address, email, password);
  }

  private SetItemToFormGroup(item: UserModel) {
    this.itemSelect = item;
    this.frmControls?.controls['firstName'].setValue(item.firstName);
    this.frmControls?.controls['lastName'].setValue(item.lastName);
    this.frmControls?.controls['address'].setValue(item.address);
    this.frmControls?.controls['email'].setValue(item.email);
    this.frmControls?.controls['address'].setValue(item.address);
  }
}

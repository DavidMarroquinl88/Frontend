import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchModel } from '../../models/BranchModel';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { AsideComponent } from '../../../pages/components/aside/aside.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { lastValueFrom, Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchApiClient, BranchRequest } from '../../../shared/services/http.services';

@Component({
  selector: 'branch-components-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, ControlValidatorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup | undefined = undefined;
  items: BranchModel[] = [];
  itemSelect: BranchModel | undefined = undefined;
  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private loadingService: LoadingService,
    private branchService: BranchApiClient
  ) { }

  async ngOnInit(): Promise<void> {
    this.frmControls = this.formBuilder.group({
      'name': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
      'description': [null, { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)] }],
    });

    await this.readAll();

  }

  async readAll(){
    this.items = (await lastValueFrom(this.branchService.readAll())).map(element => new BranchModel(
      element.id,
      element.name,
      element.description
    ));
  }
  onShowAddItem() {
    this.frmControls?.reset();
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Sucursal";
  }

  onShowEditItem(item: BranchModel) {
    this.frmControls?.reset();
    this.SetItemToFormGroup(item);
    this.typeCommand = "Editar";
    this.titleModal = "Editar Sucursal";
    this.showModal = true;
  }

  onDeleteItem(element: BranchModel) {

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

  async processItem() {

    if (this.frmControls?.invalid) {
      this.frmControls.markAllAsTouched();
      this.messageService.showApiWarning("Verifica que la información sea correcta");
      return;
    }

    let element = this.GetItemFromFormGroup();

    if (this.typeCommand === 'Editar') {
      await this.updateItem(element);
    }

    if (this.typeCommand === 'Agregar') {
      await this.craeteItem(element);
    }

    this.showModal = false;
  }

  async craeteItem(element: BranchModel) {

    this.loadingService.Show();
    let resultCreate = await lastValueFrom(this.branchService.create(new BranchRequest(
      {
        name: element.name,
        description: element.description
      }
    )));
    this.loadingService.Hide();

    if (resultCreate.isSuccess) {
      await this.readAll();
      this.messageService.showApiSucess("El Registro se ha creado correctamente");
    }
    else {
      this.messageService.showApiError("Error al crear Sucursal, comunícate con el administrador");
    }
  }

  async updateItem(element: BranchModel) {
    element.id = this.itemSelect?.id;

    this.loadingService.Show();

    let resultUpdate = await lastValueFrom(this.branchService.update(new BranchRequest(
      {
        id: element.id,
        name: element.name,
        description: element.description
      }
    )));
    this.loadingService.Hide();

    if (resultUpdate.isSuccess) {
      await this.readAll();
      this.messageService.showApiSucess("El Registro se ha actualizado correctamente");
    }
    else {
      this.messageService.showApiError("Error al actualizar Sucursal, comunícate con el administrador");
    }
  }

  async deleteItem() {

    this.loadingService.Show();
    var result = await lastValueFrom(this.branchService.delete(this.itemSelect!.id!));
    this.loadingService.Hide();

    if (result.isSuccess) {
      this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
      this.messageService.showApiSucess("El Registro se ha eliminado correctamente");
    }
    else {
      this.messageService.showApiSucess("Error al eliminar registro, por favor, comunícate con el administrador");
    }

  }

  private GetItemFromFormGroup(): BranchModel {

    let name: string = this.frmControls!.controls['name'].value;
    let description: string = this.frmControls!.controls['description'].value;

    return new BranchModel(1, name, description);
  }

  private SetItemToFormGroup(item: BranchModel) {
    this.itemSelect = item;
    this.frmControls?.controls['name'].setValue(item.name);
    this.frmControls?.controls['description'].setValue(item.description);
  }
}

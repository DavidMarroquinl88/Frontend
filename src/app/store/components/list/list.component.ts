import { StoreModel } from './../../models/StoreModel';
import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { AsideComponent } from '../../../pages/components/aside/aside.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { lastValueFrom, Subject } from 'rxjs';
import { BranchModel } from '../../../branch/models/BranchModel';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchApiClient, StoreApiClient, StoreRequest } from '../../../shared/services/http.services';

@Component({
  selector: 'store-component-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, FormsModule, ControlValidatorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup;

  items: StoreModel[] = [];
  itemSelect: StoreModel | undefined = undefined;

  elementsBranch: BranchModel[] = [];

  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private loadingService: LoadingService,
    private branchService: BranchApiClient,
    private storeService: StoreApiClient
  ) {
    this.frmControls = this.formBuilder.group({
      'name': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)] }],
      'branch': [null, { validators: [Validators.required] }],
      'address': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
    });

  }

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  async loadAll() {

    this.loadingService.Show();

    this.elementsBranch = (await lastValueFrom(this.branchService.readAll())).map(element => new BranchModel(
      element.id,
      element.name,
      element.description
    ));

    this.items = (await lastValueFrom(this.storeService.readAll())).map(element => new StoreModel(
      element.id,
      element.name,
      element.address,
      element.branchId,
      element.branchName
    ));

    this.loadingService.Hide();
  }

  onShowAddItem() {
    this.frmControls!.reset();
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Tienda";
  }

  onShowEditItem(item: StoreModel) {
    this.frmControls?.reset();
    this.SetItemToFormGroup(item);
    this.typeCommand = "Editar";
    this.titleModal = "Editar Tienda";
    this.showModal = true;
  }

  async onDeleteItem(element: StoreModel) {

    this.typeCommand = "Eliminar";
    this.itemSelect = element;
    let resultOperation: Subject<boolean> = new Subject();

    this.messageService.showApiMessage(new Mensaje(
      TipoMensaje.CONFIRM,
      "¿Desea eliminar el registro?",
      "Confirmar Operación",
      resultOperation
    ));

    resultOperation.subscribe(async (result) => {
      if (result) {
        await this.deleteItem();
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
      this.editItem(element);
    }

    if (this.typeCommand === 'Agregar') {
      this.addItem(element);
    }

    this.showModal = false;
  }

  async editItem(element: StoreModel) {
    element.id = this.itemSelect?.id;


    this.loadingService.Show();

    var result = await lastValueFrom(this.storeService.update(new StoreRequest({
      id: element.id,
      name: element.name,
      address: element.address,
      branchName: element.branchName,
      branchId: element.branchId
    })));

    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.loadAll();
      this.messageService.showApiSucess("El Registro se ha actualizado correctamente");
    }
    else {
      this.messageService.showApiError("Error al actualizar Tienda, comunícate con el administrador");
    }
  }

  async addItem(element: StoreModel) {

    this.loadingService.Show();

    var result = await lastValueFrom(this.storeService.create(new StoreRequest({
      name: element.name,
      address: element.address,
      branchName: element.branchName,
      branchId: element.branchId
    })));

    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.loadAll();
      this.messageService.showApiSucess("El Registro se ha creado correctamente");
    }
    else {
      this.messageService.showApiError("Error al crear Tienda, comunícate con el administrador");
    }

  }

  async deleteItem() {

    this.loadingService.Show();
    let result = await lastValueFrom(this.storeService.delete(this.itemSelect!.id!));
    this.loadingService.Hide();

    if (result.isSuccess) {
      this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
      this.messageService.showApiSucess("El Registro se ha eliminado correctamente");
    }
    else {
      this.messageService.showApiError("Error al eliminar Tienda, comunícate con el administrador");
    }

  }

  private GetItemFromFormGroup(): StoreModel {
    let name: string = this.frmControls!.controls['name'].value;
    let address: string = this.frmControls!.controls['address'].value;
    let branch: BranchModel = this.frmControls!.controls['branch'].value;

    return new StoreModel(1, name, address, branch.id, branch.name);
  }

  private SetItemToFormGroup(item: StoreModel) {
    this.itemSelect = item;
    this.frmControls?.controls['name'].setValue(item.name);
    this.frmControls?.controls['address'].setValue(item.address);
    let itemBranch = this.elementsBranch.find(element => element.id == item.branchId);
    this.frmControls?.controls['branch'].setValue(itemBranch);
  }
}

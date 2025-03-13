
import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { lastValueFrom, Subject } from 'rxjs';
import { InventoryModel } from '../../models/InventoryModel';
import { ArticleModel } from '../../../article/models/ArticleModel';
import { StoreModel } from '../../../store/models/StoreModel';
import { LoadingService } from '../../../shared/services/loading.service';
import { ArticleApiClient, InventoryApiClient, InventoryRequest, StoreApiClient } from '../../../shared/services/http.services';

@Component({
  selector: 'inventory-component-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, FormsModule, ControlValidatorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup;

  items: InventoryModel[] = [];
  itemSelect: InventoryModel | undefined = undefined;

  elementsArticles: ArticleModel[] = [];
  elementsStores: StoreModel[] = [];

  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private loadingService: LoadingService,
    private inventoryService: InventoryApiClient,
    private articleService: ArticleApiClient,
    private storeService: StoreApiClient

  ) {
    this.frmControls = this.formBuilder.group({
      'article': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)] }],
      'store': [null, { validators: [Validators.required] }],
      'stock': [null, { validators: [Validators.required, Validators.min(1), Validators.max(10000)] }],
    });


  }

  async ngOnInit(): Promise<void> {

    this.elementsArticles = ((await lastValueFrom(this.articleService.readAll()))).map(element =>
      new ArticleModel(
        element.id,
        element.code,
        element.name,
        element.description,
        element.price,
        element.imageName,
        undefined,
        element.imageUrl
      )
    );

    this.elementsStores = ((await lastValueFrom(this.storeService.readAll()))).map(element =>
      new StoreModel(
        element.id,
        element.name,
        element.address,
        element.branchId,
        element.branchName
      )
    );

    await this.loadAll();
  }

  async loadAll() {
    this.items = (await lastValueFrom(this.inventoryService.readAll())).map(element =>
      new InventoryModel(
        element.id,
        element.articleId,
        element.articleCode,
        element.articleName,
        element.storeId,
        element.storeName,
        element.branchId,
        element.branchName,
        element.stock
      )
    );
  }


  onShowAddItem() {
    this.frmControls!.reset();
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Producto a Tienda";
  }

  onShowEditItem(item: InventoryModel) {
    this.frmControls?.reset();
    this.SetItemToFormGroup(item);
    this.typeCommand = "Editar";
    this.titleModal = "Editar Producto de Tienda";
    this.showModal = true;
  }

  onDeleteItem(element: InventoryModel) {

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

  async editItem(element: InventoryModel) {

    let article: ArticleModel = this.frmControls.controls['article'].value;
    let store: StoreModel = this.frmControls.controls['store'].value;
    let stock: number = this.frmControls.controls['stock'].value;

    this.loadingService.Show();
    let result = (await lastValueFrom(this.inventoryService.update(
      new InventoryRequest({
        id: this.itemSelect?.id,
        articleId: article.id,
        storeId: store.id,
        stock: stock
      })
    )));
    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.loadAll();
      this.messageService.showApiSucess("El Registro se ha actualizado correctamente");
    }
    else
      this.messageService.showApiError("Error al actualizar registro");
  }

  async addItem(element: InventoryModel) {

    let article: ArticleModel = this.frmControls.controls['article'].value;
    let store: StoreModel = this.frmControls.controls['store'].value;
    let stock: number = this.frmControls.controls['stock'].value;

    this.loadingService.Show();
    let result = (await lastValueFrom(this.inventoryService.create(
      new InventoryRequest({
        articleId: article.id,
        storeId: store.id,
        stock: stock
      })
    )));
    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.loadAll();
      this.messageService.showApiSucess("El Registro se ha creado correctamente");
    }
    else
      this.messageService.showApiError("Error al crear registro");

  }

  async deleteItem() {

    var result = await lastValueFrom(this.inventoryService.delete(this.itemSelect!.id!));

    if (result.isSuccess) {
      this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
      this.messageService.showApiSucess("El Registro se ha eliminado correctamente");
    }
    else {
      this.messageService.showApiSucess("Error al eliminar registro");
    }

  }

  private GetItemFromFormGroup(): InventoryModel {
    let article: ArticleModel = this.frmControls!.controls['article'].value;
    let store: StoreModel = this.frmControls!.controls['store'].value;
    let stock: number = this.frmControls!.controls['stock'].value;

    return new InventoryModel(1, article.id, article.code, article.name, store.id, store.name, store.branchId, store.branchName, stock);
  }

  private SetItemToFormGroup(item: InventoryModel) {

    this.itemSelect = item;

    let itemStore = this.elementsStores.find(element => element.id == item.storeId);
    let itemArticle = this.elementsArticles.find(element => element.id == item.articleId);


    this.frmControls?.controls['article'].setValue(itemArticle);
    this.frmControls?.controls['store'].setValue(itemStore);
    this.frmControls?.controls['stock'].setValue(item.stock);

  }
}

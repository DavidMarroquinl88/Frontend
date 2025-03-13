import { Component, OnInit, SecurityContext } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { lastValueFrom, Subject } from 'rxjs';
import { ArticleModel } from '../../models/ArticleModel';
import { ControlImgComponent } from '../../../shared/components/control-img/control-img.component';
import { LoadingService } from '../../../shared/services/loading.service';
import { ArticleApiClient } from '../../../shared/services/http.services';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'branch-components-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, ControlValidatorComponent, ControlImgComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup | undefined = undefined;
  items: ArticleModel[] = [];
  itemSelect: ArticleModel | undefined = undefined;
  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;

  //for imagen
  displayImage: boolean = false;
  titleImage: string = "";
  uploadImage: File | null = null;
  disabledImg: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private loadingService: LoadingService,
    private articleService: ArticleApiClient,
    private sanitizer: DomSanitizer
  ) {
    this.frmControls = this.formBuilder.group({
      'code': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(5)] }],
      'name': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
      'description': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
      'price': [null, { validators: [Validators.required, Validators.min(1), Validators.max(500000000)] }],
      'image': [null, { validators: [Validators.required] }],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.readAll();
  }


  async readAll() {

    this.loadingService.Show();

    this.items = (await lastValueFrom(this.articleService.readAll())).map(element => new ArticleModel(
      element.id,
      element.code,
      element.name,
      element.description,
      element.price,
      element.imageName,
      undefined,
      element.imageUrl
    ));

    this.loadingService.Hide();
  }

  setImage(event: File | null) {
    this.uploadImage = event;
  }

  onShowAddItem() {
    this.frmControls?.reset();
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Artículo";
  }

  async onShowEditItem(item: ArticleModel) {
    this.itemSelect = item;
    this.frmControls?.reset();
    await this.SetItemToFormGroup(item);
    this.typeCommand = "Editar";
    this.titleModal = "Editar Artículo";
    this.showModal = true;
  }

  onDeleteItem(element: ArticleModel) {

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
    this.uploadImage = null;
  }

  async onSave() {

    if (this.frmControls?.invalid) {
      this.frmControls.markAllAsTouched();
      this.messageService.showApiWarning("Verifica que la información sea correcta");
      return;
    }

    let element = this.GetItemFromFormGroup();

    if (this.typeCommand === "Agregar") {
      await this.CreateItem(element);
    }

    if (this.typeCommand === "Editar") {
      await this.updateItem(element);
    }
  }

  async CreateItem(element: ArticleModel) {

    this.loadingService.Show();

    let fileData = {
      data: this.uploadImage,
      fileName: this.uploadImage!.name
    };

    let result = (await lastValueFrom(this.articleService.create(
      element.id,
      element.code,
      element.name,
      element.description,
      element.price,
      this.uploadImage!.name,
      fileData,
      element.imageUrl
    )));

    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.readAll();
      this.messageService.showApiSucess("El Registro se ha creado correctamente");
    }
    else {
      this.messageService.showApiError("Error al crear Registro");
    }

    this.showModal = false;
  }

  async updateItem(element: ArticleModel) {

    this.loadingService.Show();

    let fileData = {
      data: this.uploadImage,
      fileName: this.uploadImage!.name
    };

    let result = (await lastValueFrom(this.articleService.update(
      this.itemSelect!.id!,
      element.code,
      element.name,
      element.description,
      element.price,
      this.uploadImage!.name,
      fileData,
      element.imageUrl
    )));

    this.loadingService.Hide();

    if (result.isSuccess) {
      await this.readAll();
      this.messageService.showApiSucess("El Registro se ha creado correctamente");
    }
    else {
      this.messageService.showApiError("Error al crear Registro");
    }

    this.showModal = false;
  }

  async deleteItem() {

    this.loadingService.Show();
    let result = (await lastValueFrom(this.articleService.delete(this.itemSelect!.id!)));
    this.loadingService.Hide();

    if (result.isSuccess) {
      this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
      this.messageService.showApiSucess("El registro se ha eliminado correctamente");
    }
    else {
      this.messageService.showApiError("Error al eliminar registro, comunícate con el administrador");
    }

  }

  private GetItemFromFormGroup(): ArticleModel {

    let name: string = this.frmControls?.controls['name'].value;
    let code: string = this.frmControls!.controls['code'].value;
    let description: string = this.frmControls!.controls['description'].value;
    let price: number = this.frmControls!.controls['price'].value;
    let image: string = this.frmControls!.controls['image'].value.name;

    return new ArticleModel(1, code, name, description, price, image);
  }

  private async SetItemToFormGroup(item: ArticleModel) {
    this.itemSelect = item;
    this.frmControls?.controls['code'].setValue(item.code);
    this.frmControls?.controls['name'].setValue(item.name);
    this.frmControls?.controls['description'].setValue(item.description);
    this.frmControls?.controls['price'].setValue(item.price);
    
    this.uploadImage = await this.getUrlFileSecurity(this.itemSelect.imageUrl!, this.itemSelect.imageName!);

    this.SetValueInFormImage();
  }

  //events for image
  SetValueInFormImage() {
    this.frmControls!.controls['image'].setValue(this.uploadImage);
  }


  private async getUrlFileSecurity(url: string, name: string): Promise<File | null> {

    return new Promise<File | null>(async (resolver, reject) => {

      let MIMEFile: string = "";

      let extension = "image/" + name.split('.').pop();

      let itemFile: File = await this.GetImageURL(url, name, extension);

      resolver(itemFile);

    });
  }

  private async GetImageURL(url: string, fileName: string, fileType: string): Promise<File> {
    var myRequest = new Request(url);
    var resultado: any;

    try {
      resultado = await fetch(myRequest,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            Accept: 'application/json',
          },
        }
      ).then(r => r.blob())
        .then(blobFile => {
          let fileItem = new File([blobFile], fileName, { type: fileType });
          (<any>fileItem).objectURL = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(blobFile))));

          return fileItem;
        });
    } catch (error) {
      console.log(error);
    }

    return resultado;
  }

}

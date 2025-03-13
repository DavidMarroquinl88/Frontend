import { Component, OnInit } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageCustomService } from '../../../shared/services/message.service';
import { ControlValidatorComponent } from '../../../shared/components/control-validator/control-validator.component';
import { Mensaje, TipoMensaje } from '../../../shared/models/Mensaje';
import { lastValueFrom, Subject } from 'rxjs';
import { ShoppingArticleModel } from '../../models/shoppingArticleModel';
import { ArticleToQuantityModel } from '../../models/ArticleToQuantity';
import { LoadingService } from '../../../shared/services/loading.service';
import { ArticleApiClient, OrderApiClient, OrderDetailRequest, OrderRequest, OrderValidateRequest } from '../../../shared/services/http.services';


@Component({
  selector: 'shopping-components-list',
  imports: [PrimengCommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  frmControls: FormGroup | undefined = undefined;
  articles: ArticleToQuantityModel[] = [];
  items: ShoppingArticleModel[] = [];
  itemSelect: ShoppingArticleModel | undefined = undefined;
  titleModal: string | undefined = undefined;
  showModal: boolean = false;
  typeCommand: 'Agregar' | 'Eliminar' | 'Editar' | undefined = undefined;
  quantity: number | undefined = undefined;

  key: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageCustomService,
    private loadingService: LoadingService,
    private orderService: OrderApiClient,
    private articlesService: ArticleApiClient
  ) { }

  async ngOnInit(): Promise<void> {

    this.frmControls = this.formBuilder.group({
      'name': [null, { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)] }],
      'description': [null, { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)] }],
    });


    this.articles = (await lastValueFrom(this.articlesService.readAll())).map(element => new ArticleToQuantityModel(
      element.id,
      element.code,
      element.name,
      element.description,
      element.price,
      element.imageUrl
    ));

    this.key = 1;
  }

  primaryKey(): number {
    return this.key++;
  }

  onShowAddItem() {
    this.articles.map(element => element.quantity = undefined);
    this.typeCommand = "Agregar";
    this.showModal = true;
    this.titleModal = "Agregar Producto";
  }


  onDeleteItem(element: ShoppingArticleModel) {
    this.itemSelect = element;
    this.deleteItem();
  }

  onClear() {
    this.frmControls?.reset();
  }

  async onShopping() {

    if (this.items.length <= 0) {
      this.messageService.showApiWarning("Debes agregar un producto para poder realizar tu compra");
      return;
    }

    let orderDetail: OrderDetailRequest[] = this.items.map(element => new OrderDetailRequest(
      {
        articleId: element.id,
        quantity: element.quantity
      }
    ));

    let total = this.items.map(element => element.articlePrice! * element.quantity!).reduce((total, num) => total + num, 0);

    let result = (await lastValueFrom(this.orderService.create(
      new OrderRequest({
        userId: 1,
        total: total,
        orderDetail: orderDetail
      })
    )));

    if (result.isSuccess) {
      this.items = [];
      this.messageService.showApiMessage(new Mensaje(TipoMensaje.CONFIRM, "Tu compra se realizó correctamente, a tu correo llegará el detalle de tu compra", "Compra Exitosa"));
    }
    else {
      this.messageService.showApiError("Error al realizar compra, valida con el administrador");
    }
  }

  async onAddArticle(articleAdd: ArticleToQuantityModel) {

    if (articleAdd.quantity! <= 0 || articleAdd.quantity == undefined) {
      this.messageService.showApiWarning("La cantidad de producto es requerida");
      return;
    }

    this.loadingService.Show();
    let result = (await lastValueFrom(this.orderService.validateQuiantityToProduct(
      new OrderValidateRequest({
          articleId : articleAdd.id,
          quantity : articleAdd.quantity
      })
    )));
    this.loadingService.Hide();
    
    if(!result.isSuccess){
      this.messageService.showApiWarning(result.messageError!);
      return;
    }

    let element = this.GetItemFromFormGroup({ ...articleAdd });

    this.items.push(element);

    this.showModal = false;
  }

  deleteItem() {
    this.items = this.items.filter(element => element!.id != this.itemSelect?.id);
  }

  private GetItemFromFormGroup(articleAdd: ArticleToQuantityModel): ShoppingArticleModel {

    return new ShoppingArticleModel(this.primaryKey(), articleAdd.code, articleAdd.name, articleAdd.description, articleAdd.price, articleAdd.quantity);
  }

}

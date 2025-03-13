import { ShoppingArticleModel } from '../models/shoppingArticleModel';

export class ShoppingModel {
  constructor(
    public id: number | undefined = undefined,
    public ShoppingArticles: ShoppingArticleModel[] | undefined = []
  ) {

  }
}

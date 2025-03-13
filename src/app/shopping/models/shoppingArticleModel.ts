export class ShoppingArticleModel {


  constructor(
    public id: number | undefined = undefined,
    public articleCode: string | undefined = undefined,
    public articleName: string | undefined = undefined,
    public articleDescription: string | undefined = undefined,
    public articlePrice: number | undefined = undefined,
    public quantity: number | undefined = undefined
  ) {

  }
}

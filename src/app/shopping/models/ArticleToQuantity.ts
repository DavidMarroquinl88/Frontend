export class ArticleToQuantityModel {

  constructor(
    public id: number | undefined = undefined,
    public code: string | undefined = undefined,
    public name: string | undefined = undefined,
    public description: string | undefined = undefined,
    public price: number | undefined = undefined,
    public imageUrl: string | undefined = undefined,
    public quantity: number | undefined = undefined
  ) {

  }

}

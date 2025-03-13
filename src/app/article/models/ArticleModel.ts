export class ArticleModel {

  constructor(
    public id: number | undefined = undefined,
    public code: string | undefined = undefined,
    public name: string | undefined = undefined,
    public description: string | undefined = undefined,
    public price: number | undefined = undefined,
    public imageName: string | undefined = undefined,
    public image: File | undefined = undefined,
    public imageUrl: string | undefined = undefined
  ) {

  }

}

export class InventoryModel {

  constructor(
    public id: number | undefined = undefined,
    public articleId: number | undefined = undefined,
    public articleCode: string | undefined = undefined,
    public articleName: string | undefined = undefined,
    public storeId: number | undefined = undefined,
    public storeName: string | undefined = undefined,
    public branchId: number | undefined = undefined,
    public branchName: string | undefined = undefined,
    public stock: number | undefined = undefined
  ) {

  }

}

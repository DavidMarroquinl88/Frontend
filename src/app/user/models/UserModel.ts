export class UserModel {

  constructor(
    public id: number | undefined = undefined,
    public firstName: string | undefined = undefined,
    public lastName: string | undefined = undefined,
    public address: string | undefined = undefined,
    public email: string | undefined = undefined,
    public password: string | undefined = undefined,
  ) { }

}

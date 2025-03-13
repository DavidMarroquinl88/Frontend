import { Mensaje, TipoMensaje } from "./Mensaje";

export enum MessageToShow {

  ErrorLoadData = "Error al cargar los datos, por favor, comunicate con el administrador",
  ErrorAddData = "Error al agregar registro, por favor, comunicate con el administrador",
  ErrorDeleteData = "Error al eliminar registro, por favor, comunicate con el administrador",
  ErrorProcess = "Error al realizar la operación, por favor, comunicate con el administrador",
  SuccessProcess = "La operación se ha realizado con éxito",
  SuccessEditProcess = "La edición del registro se ha realizado con éxito",
  SuccessAddProcess = "La creación del registro se ha realizado con éxito ",
  SuccessDeleteProcess = "El registro se ha eliminado con éxito",
  SuccessCopyURL = "La URL se ha copiado",
  SuccessCopyText = "El texto se ha copiado correctamente",
  ConfirmDeleteProcess = "¿Desea eliminar el registro ?",
}


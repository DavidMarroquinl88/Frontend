import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import format from 'string-format';


@Injectable()
export class ControlValidatorService {


  readonly genericMessages = {
    closeRange: 'Se requiere un rango cerrado',
    dateRange: 'Rango inválido',
    email: 'Formato de email inválido',
    min: 'El valor mínimo permitido es {min}',
    max: 'El valor máximo permitido es {max}',
    maxlength: 'Se superó la longitud máxima permitida {requiredLength}',
    minlength: '{actualLength} de {requiredLength} caracteres mínimos requeridos',
    required: 'Campo requerido',
    customMax: 'Máximo {max}',
    customMin: 'Mínimo {min}',
    pattern: 'Dato con formato inválido',
    notEqual: 'El password es diferente'
  };

  /*
  * Método encargado de mostrar la validación de todos los campos del formulario
  */
  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control?.disabled) {
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
      }
    });
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any, customMessages?: any) {

    let message;

    if (customMessages) {
      message = this.getMessage(customMessages, validatorName, validatorValue);
    }

    return message ? message : this.getMessage(this.genericMessages, validatorName, validatorValue);
  }

  private getMessage(dictionary: any, key: string, vars: any): string {
    const message = dictionary[key];
    return vars && typeof vars === 'object' && message ?
      format(message, vars) :
      message;
  }
}


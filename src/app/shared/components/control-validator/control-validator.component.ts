import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ControlValidatorService } from '../../services/control-validator.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'control-validator',
  imports: [CommonModule],
  templateUrl: './control-validator.component.html',
  providers: [ControlValidatorService]
})
export class ControlValidatorComponent implements AfterContentInit {

  @ContentChild(NgControl, { static: true }) ngControl: any;

  @Input() messages: any;

  constructor(private controlValidators: ControlValidatorService) { }

  ngAfterContentInit(): void {
    if (!this.ngControl) {
      console.warn('Control validator without ngControl');
    }
  }

  get errorMessage() {
    if (this.ngControl) {
      for (const propertyName in this.ngControl.errors) {
        if (this.ngControl.errors.hasOwnProperty(propertyName) &&
          this.ngControl.touched ||
          this.ngControl._parent && this.ngControl._parent.submitted) {

          return this.controlValidators.getValidatorErrorMessage(propertyName, this.ngControl.errors[propertyName], this.messages);
        }
      }
    }

    return null;
  }
}

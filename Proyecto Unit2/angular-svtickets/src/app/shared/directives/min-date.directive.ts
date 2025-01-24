import { Directive, input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[minDate]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: MinDateDirective, multi: true}]
})
export class MinDateDirective implements Validator {
  minDate = input.required<string>();

  validate(control: FormControl<string>): ValidationErrors | null {
      if (this.minDate() && control.value && this.minDate() > control.value) {
        return { minDate: true }; // Error returned
      }

      return null; // No errors
  }
}

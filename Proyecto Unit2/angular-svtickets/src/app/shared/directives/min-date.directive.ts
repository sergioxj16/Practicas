import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    const min = new Date(minDate);
    return date >= min ? null : {minDate: {minDate, actual: control.value}};
  };
}

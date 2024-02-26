import { FormGroup } from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(formGroup: FormGroup): any {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}

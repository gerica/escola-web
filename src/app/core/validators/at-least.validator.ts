import { AbstractControl, ValidatorFn } from "@angular/forms";

/**
 * @description
 * Validador utilizado para verificar se pelo menos um dos campos do formulário está preenchido
 *
 * @param controlsName nomes dos controles do formulário
 * @returns null caso pelo menos um dos campos do formulário estejam preenchidos
 * @returns Object: { atLeast: true } caso todos os campos estejam em branco
 */
export const atLeastValidator = (...controlsName: string[]): ValidatorFn => {
  return (group: AbstractControl) => {
    const result = controlsName
      .map(controlName => group.get(controlName))
      .map(control => control?.value?.trim())
      .reduce((prev, curr) => !!(prev || curr), false);
    return result ? null : { atLeast: true };
  };
};

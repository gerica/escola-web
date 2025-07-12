import { AbstractControl } from "@angular/forms";

const phonePattern = /\d{2}(\d)?(\d)\d{3}\d{4}$/;

export const phoneValidator = (control: AbstractControl) => {
  if (!control.value) return null;

  const matches = control.value.match(phonePattern);
  let msg = null;
  if (matches === null) {
    msg = 'Informe todos os dígitos do telefone.';
  } else if (matches[1] !== undefined && matches[1] !== '9') {
    msg = 'Nono dígito deve ser o número 9.';
  } else if (matches[1] === undefined && matches[2] === '9') {
    msg = 'Número com 8 dígitos não deve iniciar com 9.';
  }
  return msg ? { 'phone': msg } : null;
};

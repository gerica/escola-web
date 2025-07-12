import { AbstractControl } from '@angular/forms';

const cpfLength = 11;
const cnpjLength = 14;

const buildDigit = (arr: number[]): number => {
  const isCpf = arr.length < cpfLength;

  const digit =
    arr.map((val, idx) => val * ((!isCpf ? idx % 8 : idx) + 2)).reduce((total, current) => total + current) % cpfLength;

  //if (digit < 2 && isCpf) { return 0; } else if (digit < 2) { return 0; }
  if (digit < 2 && isCpf) {
    return 0;
  }

  return cpfLength - digit;
};

/**
 * Valida um CPF ou CNPJ de acordo com seu dígito verificador.
 */
export const cpfCnpjValidator = (control: AbstractControl) => {
  if (!control.value) return null;

  const cpfCnpj = control.value.replace(/\D/g, '');

  // Verifica o tamanho da string.
  if ([cpfLength, cnpjLength].indexOf(cpfCnpj.length) < 0) {
    return { length: true };
  }

  // Verifica se todos os dígitos são iguais.
  if (/^([0-9])\1*$/.test(cpfCnpj)) {
    return { equalDigits: true };
  }

  // A seguir é realizado o cálculo verificador.
  const cpfCnpjArr: number[] = cpfCnpj.split('').reverse().slice(2);

  cpfCnpjArr.unshift(buildDigit(cpfCnpjArr));
  cpfCnpjArr.unshift(buildDigit(cpfCnpjArr));

  if (cpfCnpj !== cpfCnpjArr.reverse().join('')) {
    // Dígito verificador não é válido, resultando em falha.
    return { digit: true };
  }

  return null;
};

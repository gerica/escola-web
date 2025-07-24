import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeiraMaiuscula'
})
export class PrimeiraMaiusculaPipe implements PipeTransform {

  private preposicoes = ['da', 'de', 'do', 'das', 'dos', 'e', 'para', 'com', 'em', 'na', 'no', 'nas', 'nos', 'a', 'o', 'as', 'os', 'ante', 'após', 'até', 'com', 'contra', 'desde', 'entre', 'perante', 'sem', 'sob', 'sobre', 'trás'];

  transform(value: string | string[] | undefined): string | undefined {
    if (!value) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => this._transformString(item)).join(', ');
    }

    return this._transformString(value);
  }

  private _transformString(str: string): string {
    if (!str) {
      return str;
    }

    // Substitui underscores por espaços, converte para minúsculas e então capitaliza
    return str.replace(/_/g, ' ').toLowerCase().split(' ').map((palavra, index) => {
      if (index === 0 || !this.preposicoes.includes(palavra)) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      }
      return palavra;
    }).join(' ');
  }
}
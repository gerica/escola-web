import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeiraMaiuscula'
})
export class PrimeiraMaiusculaPipe implements PipeTransform {

  private preposicoes = ['da', 'de', 'do', 'das', 'dos', 'e', 'para', 'com', 'em', 'na', 'no', 'nas', 'nos', 'a', 'o', 'as', 'os', 'ante', 'após', 'até', 'com', 'contra', 'desde', 'entre', 'perante', 'sem', 'sob', 'sobre', 'trás'];

  transform(value: string | undefined): string | undefined {
    if (!value) {
      return value;
    }

    return value.toLowerCase().split(' ').map((palavra, index) => {
      if (index === 0 || !this.preposicoes.includes(palavra)) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      }
      return palavra;
    }).join(' ');
  }

}
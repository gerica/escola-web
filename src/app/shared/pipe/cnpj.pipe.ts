import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cnpj'
})
export class CnpjPipe implements PipeTransform {

    transform(value: string | number): string {
        if (!value) {
            return '';
        }

        // Garante que o valor é uma string e remove caracteres não numéricos
        const cleanedValue = String(value).replace(/\D/g, '');

        // Verifica se tem 14 dígitos (CNPJ)
        if (cleanedValue.length === 14) {
            return cleanedValue.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                '$1.$2.$3/$4-$5'
            );
        }
        // Se não tiver 14 dígitos ou for outro formato, retorna o valor original ou vazio
        // Você pode adicionar lógica para formatar CPF aqui também, se necessário.
        return value.toString(); // Retorna o valor original se não for um CNPJ de 14 dígitos
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

    transform(value: string | number): string {
        if (!value) {
            return '';
        }

        // Remove todos os caracteres não numéricos
        const cleanedValue = String(value).replace(/\D/g, '');

        // Verifica o tamanho do número para aplicar a máscara correta
        if (cleanedValue.length === 10) { // Formato: (XX) XXXX-XXXX (fixo ou 8 dígitos celular)
            // Ex: 1123456789 -> (11) 2345-6789
            return cleanedValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        } else if (cleanedValue.length === 11) { // Formato: (XX) XXXXX-XXXX (9 dígitos celular)
            // Ex: 11987654321 -> (11) 98765-4321
            return cleanedValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        }
        // Retorna o valor original se não corresponder a um telefone de 10 ou 11 dígitos
        return value.toString();
    }
}
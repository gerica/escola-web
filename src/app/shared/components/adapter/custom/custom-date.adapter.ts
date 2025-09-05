import { NativeDateAdapter } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';

export class CustomDateAdapter extends NativeDateAdapter {
    override format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            const mes = date.getMonth() + 1; // getMonth() retorna de 0-11
            const ano = date.getFullYear();

            // Formata a data como 'MM/AAAA'
            return `${this._to2digit(mes)}/${ano}`;
        }
        return this.toIso8601(date);
    }

    // Método auxiliar para adicionar um zero se o número for menor que 10
    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}

export const MAT_CUSTOM_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'input',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

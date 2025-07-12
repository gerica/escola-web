import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;

        // Remove any non-digit characters (if present)
        const cleanValue = value.replace(/\D/g, '');

        // Format the value as (00)0000-0000
        const match = cleanValue.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return value;  // Return original value if it's not a valid phone number
    }
}
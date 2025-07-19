import * as moment from "moment";

export class DataUtils {
    createDateTime(date: Date | null | undefined,
        hours: number | null | undefined,
        minutes: number | null | undefined): Date | null {
        if (!date || hours === null || hours === undefined || minutes === null) {
            return null;
        }

        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0); // Set hours, minutes, and reset seconds/milliseconds
        return result;
    }

    addDaysToDate2(date: Date | null | undefined, days: number | null | undefined): Date | null {
        if (date === null || date === undefined
            || days === null || days === undefined) {
            return null;
        }
        // Create a new Date object to avoid mutating the original date
        const newDate = new Date(date);

        // Add the specified number of days
        newDate.setDate(newDate.getDate() + days);

        return newDate;
    }

    addDaysToDate(date: moment.Moment | null | undefined, days: number | null | undefined): moment.Moment | null {
        // Check for null or undefined inputs
        if (date === null || date === undefined || days === null || days === undefined) {
            return null;
        }

        // Use Moment.js to add the specified number of days
        const newDate = date.clone().add(days, 'days');

        return newDate;
    }

    // utils/date-formatter.ts (or similar)
    static formatDateToYYYYMMDD(date: Date | string | undefined | null): string | null {
        // 1. Handle null or undefined input first
        if (!date) {
            return null;
        }

        // 2. Check if the input is already a string in YYYY-MM-DD format
        if (typeof date === 'string') {
            // A simple regex to check for 'YYYY-MM-DD' format
            const YYYY_MM_DD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
            if (YYYY_MM_DD_REGEX.test(date)) {
                // console.log("Input is already in YYYY-MM-DD format:", date);
                return date; // It's already in the correct string format, return it
            } else {
                // If it's a string but not in the expected format,
                // you might want to try parsing it to a Date object
                // or just log a warning and return null/rethrow.
                // For this example, we'll try to parse it into a Date.
                console.warn(`String date "${date}" is not in YYYY-MM-DD format. Attempting to parse as Date.`);
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) { // Check if parsing resulted in an invalid date
                    console.error(`Could not parse invalid date string: ${date}`);
                    return null;
                }
                date = parsedDate; // Use the parsed Date object for formatting
            }
        }

        // 3. If it's a Date object (or was successfully parsed from a string)
        // console.log("Input is a Date object (or successfully parsed):", date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    static formatDateToISOString(date: Date | string | undefined | null): string | null {
        if (!date) {
            return null;
        }

        let dateObj: Date;
        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.error(`Could not parse invalid date string: ${date}`);
                return null;
            }
        } else {
            dateObj = date;
        }

        // toISOString() retorna algo como "2025-06-22T03:00:00.000Z" (UTC)
        // Se o seu backend espera a hora local, você pode precisar ajustar
        // ou formatar manualmente para YYYY-MM-DDTHH:MM:SS
        // Exemplo para formato local YYYY-MM-DDTHH:MM:SS:
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    static formatDateToISOStringWithMillisUTC(date: Date | string | undefined | null): string | null {
        if (!date) {
            return null;
        }

        let dateObj: Date;
        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.error(`Could not parse invalid date string: ${date}`);
                return null;
            }
        } else {
            dateObj = date;
        }

        // toISOString() retorna algo como "YYYY-MM-DDTHH:MM:SS.sssZ"
        // Ex: "2025-06-21T21:00:00.000Z" (assumindo que a data original era 18:00 no seu fuso horário e UTC+3)
        return dateObj.toISOString();
    }

    // No seu componente Angular, ao enviar para o backend:
    // const dataAssinaturaParaEnviar = MyDateUtil.formatDateToISOStringWithMillisUTC(someDateVariable);
    // Isso enviará: "2025-06-22T00:00:00.000Z" (se a data do cliente for 21/06 21:00 -03, em UTC é 22/06 00:00)

    // No seu componente Angular, você chamaria:
    // const dataAssinaturaParaEnviar = MyDateUtil.formatDateToISOString(someDateVariable);
}
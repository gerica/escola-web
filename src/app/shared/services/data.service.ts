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

    /**
     * Formats a Date object or a date string into 'YYYY-MM-DD HH:mm'.
     * @param dateTime The date/time to format (Date object, or string).
     * @returns The formatted date/time string, or null if input is invalid/null.
     */
    static formatDateToYYYYMMDDHHMM(dateTime: Date | string | undefined | null): string | null {
        // 1. Handle null or undefined input first
        if (!dateTime) {
            return null;
        }

        let dateObject: Date;

        // 2. Check if the input is already a string in YYYY-MM-DD HH:mm format
        if (typeof dateTime === 'string') {
            const YYYY_MM_DD_HH_MM_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
            if (YYYY_MM_DD_HH_MM_REGEX.test(dateTime)) {
                return dateTime; // It's already in the correct string format, return it
            } else {
                // If it's a string but not in the expected format,
                // try parsing it to a Date object.
                console.warn(`String datetime "${dateTime}" is not in YYYY-MM-DD HH:mm format. Attempting to parse as Date.`);
                const parsedDateTime = new Date(dateTime);
                if (isNaN(parsedDateTime.getTime())) { // Check if parsing resulted in an invalid date
                    console.error(`Could not parse invalid datetime string: ${dateTime}`);
                    return null;
                }
                dateObject = parsedDateTime; // Use the parsed Date object for formatting
            }
        } else {
            // If it's already a Date object
            dateObject = dateTime;
        }

        // 3. If it's a Date object (or was successfully parsed from a string)
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = dateObject.getDate().toString().padStart(2, '0');
        const hours = dateObject.getHours().toString().padStart(2, '0');
        const minutes = dateObject.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    /**
     * Formats a Date object or a date string into 'YYYY-MM-DDTHH:mm:ssZ' (RFC3339 compliant).
     * This method will try to parse any given date string into a Date object
     * and then format it. If the input is only time (e.g., 'HH:mm'), it will assume
     * today's date for parsing.
     *
     * @param dateTime The date/time to format (Date object, or string).
     * @returns The formatted date/time string in RFC3339, or null if input is invalid/null.
     */
    static formatDateToRFC3339(dateTime: Date | string | undefined | null): string | null {
        if (!dateTime) {
            return null;
        }

        let dateObject: Date;

        if (typeof dateTime === 'string') {
            // Check for HH:mm format (time only)
            const HH_MM_REGEX = /^\d{2}:\d{2}$/;
            if (HH_MM_REGEX.test(dateTime)) {
                // If only time is provided, combine with a dummy date (today) to create a valid Date object.
                // This is crucial for LocalTime inputs from the timepicker.
                const today = new Date();
                const [hours, minutes] = dateTime.split(':').map(Number);
                today.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to 0
                dateObject = today;
            } else {
                // Attempt to parse other date string formats
                const parsedDateTime = new Date(dateTime);
                if (isNaN(parsedDateTime.getTime())) {
                    console.error(`Could not parse invalid datetime string: ${dateTime}`);
                    return null;
                }
                dateObject = parsedDateTime;
            }
        } else {
            // If it's already a Date object
            dateObject = dateTime;
        }

        // Format to ISO string and slice to HH:mm:ss part.
        // toISOString() returns in UTC, e.g., "2025-07-28T17:53:09.919Z"
        // If your backend expects local time without timezone conversion,
        // you might need a different approach (see alternative below).
        // For RFC3339 with local timezone, it's more complex as toISOString is UTC.

        // A common approach for RFC3339 is to use the local time components
        // and append the timezone offset.

        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObject.getDate().toString().padStart(2, '0');
        const hours = dateObject.getHours().toString().padStart(2, '0');
        const minutes = dateObject.getMinutes().toString().padStart(2, '0');
        const seconds = dateObject.getSeconds().toString().padStart(2, '0'); // Include seconds for RFC3339 compliance

        // Calculate timezone offset
        const offset = dateObject.getTimezoneOffset(); // in minutes
        const offsetAbs = Math.abs(offset);
        const offsetSign = offset > 0 ? '-' : '+';
        const offsetHours = Math.floor(offsetAbs / 60).toString().padStart(2, '0');
        const offsetMinutes = (offsetAbs % 60).toString().padStart(2, '0');
        const timezoneOffset = `${offsetSign}${offsetHours}:${offsetMinutes}`;

        // Return the RFC3339 string
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffset}`;
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

    static formatTimeForGraphQL(date: Date | string | undefined | null): string | null {
        if (!date) {
            return null;
        }

        let dateObj: Date;

        if (typeof date === 'string') {
            // Se for uma string, tenta criar um objeto Date a partir dela.
            // É importante que a string seja em um formato que o construtor Date() entenda.
            // Para strings como "HH:MM:SS" ou "YYYY-MM-DDTHH:MM:SS", isso geralmente funciona.
            dateObj = new Date(date);
        } else {
            // Se já for um objeto Date, usa-o diretamente.
            dateObj = date;
        }

        // Verifica se a conversão resultou em uma data válida.
        // new Date('string inválida') pode retornar um objeto Date com valor inválido.
        if (isNaN(dateObj.getTime())) {
            console.warn(`Data inválida fornecida para formatTimeForGraphQL: ${date}`);
            return null; // Ou lance um erro, dependendo do seu tratamento de erro.
        }

        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`; // Formato HH:MM:SS
    }

    // No seu componente Angular, ao enviar para o backend:
    // const dataAssinaturaParaEnviar = MyDateUtil.formatDateToISOStringWithMillisUTC(someDateVariable);
    // Isso enviará: "2025-06-22T00:00:00.000Z" (se a data do cliente for 21/06 21:00 -03, em UTC é 22/06 00:00)

    // No seu componente Angular, você chamaria:
    // const dataAssinaturaParaEnviar = MyDateUtil.formatDateToISOString(someDateVariable);

    static getDataAntesEDepois(): { horaAntes: Date, horaDepois: Date } {
        const now = new Date();
        const horaAntes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0); // 17:00:00
        const horaDepois = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0); // 18:00:00
        return { horaAntes, horaDepois };
    }

    static getDateHoursMinute(timeString: String) {
        // Parse the hours and minutes from the string
        const [hours, minutes] = timeString.split(':').map(Number);

        // Create a Date object with today's date and the specified time
        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds

        return date; // e.g., Mon Jul 28 2025 10:30:00 GMT-0300 (if today is July 28, 2025)
    }
}
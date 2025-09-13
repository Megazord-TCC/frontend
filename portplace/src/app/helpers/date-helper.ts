

// Formata data do tipo "YYYY-MM-DD" para "DD/MM/YYYY"
export function formatDateFromYYYYMMDDWithHyphenToDDMMYYYYWithSlash(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

export function getYearFromDateFormatDDMMYYYY(dateString: string, separator = '/'): number {
    const [day, month, year] = dateString.split(separator);
    return Number(year);
}

export function getMonthFromDateFormatDDMMYYYY(dateString: string, separator = '/'): number {
    const [day, month, year] = dateString.split(separator);
    return Number(month);
}

// Transforma de "DD/MM/YYYY HH:MM:SS" para objeto Date
export function getDateObjectFromDDMMYYYYHHMMSS(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(part => Number(part));
    const [hours, minutes, seconds] = timePart.split(':').map(part => Number(part));
    return new Date(year, month - 1, day, hours, minutes, seconds);
}
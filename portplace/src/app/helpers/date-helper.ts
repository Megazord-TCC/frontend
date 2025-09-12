

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
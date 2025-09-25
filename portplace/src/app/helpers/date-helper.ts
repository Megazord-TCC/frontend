

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

// Transforma de objeto Date para "DD/MM/YYYY HH:MM:SS"
export function getDDMMYYYYHHMMSSFromDateObject(date?: Date): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(4, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


// Transforma de "DD/MM/YYYY HH:MM" para "YYYY-MM-DDTHH:MM"
export function getYYYYMMDDTHHMMFromDDMMYYYYHHMM(dateString?: string): string {
    if (!dateString) return '';
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(part => Number(part));
    const [hours, minutes] = timePart.split(':').map(part => Number(part));
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export function parseFormatedBRLToNumber(formatted: string): number {
    // Remove pontos, troca vírgula por ponto, converte para float
    return Number(formatted.replace(/\./g, '').replace(',', '.')) || 0;
}

export function formatToBRL(value: number | string): string {
    let num = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : value;
    if (isNaN(num)) return '0,00';
    return num
        .toFixed(2) // duas casas decimais
        .replace('.', ',') // separador decimal
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // separador de milhares
}

export function handleScenarioBudgetKeyDown(
    event: KeyboardEvent,
    getValue: () => string,
    setValue: (v: string) => void
) {
    const input = event.target as HTMLInputElement;
    let digits = getValue().replace(/\D/g, '');

    if (event.key.match(/^[0-9]$/)) {
        if (digits.length >= 15) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        digits += event.key;
        digits = digits.replace(/^0+/, '');
        while (digits.length < 3) digits = '0' + digits;
        digits = digits.slice(-15);

        const cents = digits.slice(-2);
        let reais = digits.slice(0, -2);
        reais = reais.slice(-13);
        reais = reais.replace(/^0+/, '') || '0';
        reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const formatted = `${reais},${cents}`;
        setValue(formatted);
        input.value = formatted;

        setTimeout(() => {
            input.selectionStart = input.selectionEnd = input.value.length;
        }, 0);
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        digits = digits.slice(0, -1);
        while (digits.length < 3) digits = '0' + digits;
        digits = digits.slice(-15);

        const cents = digits.slice(-2);
        let reais = digits.slice(0, -2);
        reais = reais.slice(-13);
        reais = reais.replace(/^0+/, '') || '0';
        reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const formatted = `${reais},${cents}`;
        setValue(formatted);
        input.value = formatted;

        setTimeout(() => {
            input.selectionStart = input.selectionEnd = input.value.length;
        }, 0);
    } else if (
        event.key === 'Tab' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Home' ||
        event.key === 'End'
    ) {
        return;
    } else {
        event.preventDefault();
    }
}
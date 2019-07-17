export const from_ascii = (value: string): string => {
    if (!value || value === '') return null;
    let ret = '0x';
    for (let idx = 0; idx < value.length; ++idx) {
        const char = value.charCodeAt(idx).toString(16);
        ret += char.length === 1 ? `0${char}` : char;
    }

    return ret;
};

export const to_ascii = (value: string): string => {
    if (!value || value === '') return null;
    let ret = '';
    for (let idx = 2; idx < value.length; idx += 2) {
        ret += String.fromCharCode(parseInt(value.slice(idx, idx + 2), 16));
    }
    return ret;
};

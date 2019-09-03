export const pad = (arg: string, length: number): string => {
    if (arg.length < length) {
        return pad(`0${arg}`, length);
    }
    return arg;
};

import Url from 'url-parse';

export const urlValidator = (base_url: string): boolean => {
    if (base_url === null || base_url === undefined) return true;
    const url = new Url(base_url);
    return url.origin !== 'null';
};

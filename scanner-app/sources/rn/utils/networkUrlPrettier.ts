import Url from 'url-parse';

export const networkUrlPrettier = (base_url: string): string => {
    const url = new Url(base_url);

    return url.hostname;
};

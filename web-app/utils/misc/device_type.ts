import { ClientInformations } from '../redux/app_state';

export const device_type = (infos: ClientInformations): string => {
    if (!infos) return null;

    if (['Macintosh', 'Windows', 'Linux'].indexOf(infos.device) !== -1) return 'desktop';
    return 'mobile';
};

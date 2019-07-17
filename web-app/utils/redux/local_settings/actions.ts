import { Action }             from 'redux';
import { ClientInformations } from '../app_state';

export const LocalSettingsActions = {
    SetBrowserInfos: '[LOCAL_SETTINGS] SET_BROWSER_INFOS',
    ChangeTheme: '[LOCAL_SETTINGS] CHANGE_THEME'
};

export interface ISetBrowserInfos extends Action<string> {
    device: ClientInformations;
    theme: string;
}

/**
 * Sets the browser informations fetched during app startup
 *
 * @param device
 * @param theme
 * @constructor
 */
export const SetBrowserInfos = (device: ClientInformations, theme: string): ISetBrowserInfos => ({
    type: LocalSettingsActions.SetBrowserInfos,
    device,
    theme
});

export interface IChangeTheme extends Action<string> {
    theme: string;
}

/**
 * Dynamically changes the theme
 *
 * @param theme
 * @constructor
 */
export const ChangeTheme = (theme: string): IChangeTheme => ({
    type: LocalSettingsActions.ChangeTheme,
    theme
});

export type LocalSettingsActionTypes = ISetBrowserInfos | IChangeTheme;

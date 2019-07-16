import { Reducer }                                                                         from 'redux';
import { InitialAppState, LocalSettingsSection }                                           from '../app_state';
import {
    IChangeTheme,
    ISetBrowserInfos,
    LocalSettingsActions,
    LocalSettingsActionTypes
} from './actions';

const ChangeThemeReducer: Reducer<LocalSettingsSection, IChangeTheme> =
    (state: LocalSettingsSection, action: IChangeTheme): LocalSettingsSection => ({
        ...state,
        theme: action.theme
    });

const SetBrowserInfosReducer: Reducer<LocalSettingsSection, ISetBrowserInfos> =
    (state: LocalSettingsSection, action: ISetBrowserInfos): LocalSettingsSection => ({
        ...state,
        device: {
            ...action.device
        },
        theme: action.theme
    });

export const LocalSettingsReducer: Reducer<LocalSettingsSection, LocalSettingsActionTypes> =
    (state: LocalSettingsSection = InitialAppState.local_settings, action: LocalSettingsActionTypes): LocalSettingsSection => {

        switch (action.type) {
            case LocalSettingsActions.SetBrowserInfos:
                return SetBrowserInfosReducer(state, action as ISetBrowserInfos);
            case LocalSettingsActions.ChangeTheme:
                return ChangeThemeReducer(state, action as IChangeTheme);
            default:
                return state;
        }

    };

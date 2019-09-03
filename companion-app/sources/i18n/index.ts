import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './locales/en';
import fr from './locales/fr';

i18n.fallbacks = true;
i18n.translations = { fr, en };
i18n.locale = Localization.locale;

export const I18N = i18n;

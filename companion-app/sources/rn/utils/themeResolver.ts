import { ThemeType } from 'react-native-ui-kitten';

export const themeResolver = (key: string, theme: ThemeType): string => {
    if (theme[key].indexOf('$') === 0) {
        return themeResolver(theme[key].slice(1), theme);
    }
    return theme[key];
};

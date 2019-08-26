import { Platform, StatusBar } from 'react-native';

export const statusBarHeight = (): number =>
    (Platform.OS === 'ios') ? 18 : StatusBar.currentHeight;

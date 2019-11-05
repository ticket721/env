import { Vibration } from 'react-native';

export const bump = (): void => {
    Vibration.vibrate(500);
};

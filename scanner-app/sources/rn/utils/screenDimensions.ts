import { Dimensions } from 'react-native';

export const screenWidth = (): number =>
    Dimensions.get('screen').width;

export const screenHeight = (): number =>
Dimensions.get('screen').height;

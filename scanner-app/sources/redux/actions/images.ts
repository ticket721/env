import { Action } from 'redux';
import { Image }  from '../state';

export const ImagesActions = {
    LoadImage: '@@scanner/images/loadimage',
    SetImage: '@@scanner/images/setimage'
};

export interface LoadImageAction extends Action<string> {
    url: string;
    hash: string;
}

export interface SetImageAction extends Action<string> {
    img: Image;
    hash: string;
}

export const LoadImage = (url: string, hash: string): LoadImageAction => ({
    type: ImagesActions.LoadImage,
    url,
    hash
});

export const SetImage = (img: Image, hash: string): SetImageAction => ({
    type: ImagesActions.SetImage,
    img,
    hash
});

export type ImagesActionsType = LoadImageAction | SetImageAction;

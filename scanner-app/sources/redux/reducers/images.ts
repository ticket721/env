import { Reducer }                                                           from 'redux';
import { initialState, ImagesState }                                         from '../state';
import { ImagesActions, ImagesActionsType, LoadImageAction, SetImageAction } from '../actions/images';

const ImagesLoadImageReducer: Reducer<ImagesState, LoadImageAction> = (state: ImagesState, action: LoadImageAction): ImagesState => ({
    ...state,
    [action.hash]: {
        sources: null,
        loading: true
    }
});

const ImagesSetImageReducer: Reducer<ImagesState, SetImageAction> = (state: ImagesState, action: SetImageAction): ImagesState => ({
    ...state,
    [action.hash]: {
        sources: action.img,
        loading: false
    }
});

/**
 * Main Reducer of the Imgaes Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const ImagesReducer: Reducer<ImagesState, ImagesActionsType> = (state: ImagesState = initialState.images, action: ImagesActionsType): ImagesState => {
    switch (action.type) {
        case ImagesActions.LoadImage:
            return ImagesLoadImageReducer(state, action as LoadImageAction);
        case ImagesActions.SetImage:
            return ImagesSetImageReducer(state, action as SetImageAction);
        default:
            return state;
    }
};

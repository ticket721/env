import { InitialAppState, StrapiCacheSection }                                                    from '../app_state';
import {
    IStrapiCacheNewCall, IStrapiCacheResetCall, IStrapiCacheSetData,
    IStrapiCacheSetHeight,
    IStrapiCacheSetRequired,
    StrapiCacheActions,
    StrapiCacheActionTypes
} from './actions';
import { Reducer }                                                                                from 'redux';

const StrapiCacheSetData: Reducer<StrapiCacheSection, IStrapiCacheSetData> = (state: StrapiCacheSection, action: IStrapiCacheSetData): StrapiCacheSection => {
    for (const fragment of action.fragments) {
        state.fragments[fragment.hash] = fragment.data;
    }

    return {
        ...state,
        calls: {
            ...state.calls,
            [action.call]: {
                ...state.calls[action.call],
                height: action.height,
                result: action.result,
                required: false
            }
        },
        fragments: {
            ...state.fragments
        }
    };
};

const StrapiCacheSetRequiredReducer: Reducer<StrapiCacheSection, IStrapiCacheSetRequired> = (state: StrapiCacheSection, action: IStrapiCacheSetRequired): StrapiCacheSection => ({
    ...state,
    calls: {
        ...state.calls,
        [action.hash]: {
            ...state.calls[action.hash],
            required: true
        }
    }
});

const StrapiCacheNewCallReducer: Reducer<StrapiCacheSection, IStrapiCacheNewCall> = (state: StrapiCacheSection, action: IStrapiCacheNewCall): StrapiCacheSection => ({
    ...state,
    calls: {
        ...state.calls,
        [action.hash]: {
            required: true,
            height: 0,
            call: action.cb,
            result: []
        }
    }
});

const StrapiCacheResetCallReducer: Reducer<StrapiCacheSection, IStrapiCacheResetCall> = (state: StrapiCacheSection, action: IStrapiCacheResetCall): StrapiCacheSection => {
    const call = state.calls[action.call];

    if (call && call.height) {

        call.height -= 1;

        return {
            ...state,
            calls: {
                ...state.calls,
                [action.call]: {
                    ...call
                }
            }
        };
    }

    return state;
};

const StrapiCacheSetHeightReducer: Reducer<StrapiCacheSection, IStrapiCacheSetHeight> = (state: StrapiCacheSection, action: IStrapiCacheSetHeight): StrapiCacheSection => ({
    ...state,
    height: action.height
});

export const StrapiCacheReducer = (state: StrapiCacheSection = InitialAppState.strapi_cache, action: StrapiCacheActionTypes): StrapiCacheSection => {
    switch (action.type) {
        case StrapiCacheActions.SetHeight:
            return StrapiCacheSetHeightReducer(state, action as IStrapiCacheSetHeight);
        case StrapiCacheActions.NewCall:
            return StrapiCacheNewCallReducer(state, action as IStrapiCacheNewCall);
        case StrapiCacheActions.SetRequired:
            return StrapiCacheSetRequiredReducer(state, action as IStrapiCacheSetRequired);
        case StrapiCacheActions.SetData:
            return StrapiCacheSetData(state, action as IStrapiCacheSetData);
        case StrapiCacheActions.ResetCall:
            return StrapiCacheResetCallReducer(state, action as IStrapiCacheResetCall);
        default:
            return state;
    }
};

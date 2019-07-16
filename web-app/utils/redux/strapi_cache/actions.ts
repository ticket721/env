import { Action }                        from 'redux';
import { StrapiCacheCallReturnFragment } from '../app_state';

export const StrapiCacheActions = {
    SetHeight: '[STRAPI CACHE] SET HEIGHT',
    NewCall: '[STRAPI CACHE] NEW CALL',
    SetRequired: '[STRAPI CACHE] SET REQUIRED',
    SetData: '[STRAPI CACHE] SET DATA',
    ResetCall: '[STRAPI CACHE] RESET CALL'
};

export interface IStrapiCacheResetCall extends Action<string> {
    call: string;
}

export const StrapiCacheResetCall = (call: string): IStrapiCacheResetCall => ({
    type: StrapiCacheActions.ResetCall,
    call
});

export interface IStrapiCacheSetData extends Action<string> {
    fragments: StrapiCacheCallReturnFragment[];
    call: string;
    height: number;
    result: string[];
}

export const StrapiCacheSetData = (result: string[], fragments: StrapiCacheCallReturnFragment[], call: string, height: number): IStrapiCacheSetData => ({
    type: StrapiCacheActions.SetData,
    fragments,
    result,
    call,
    height
});

export interface IStrapiCacheNewCall extends Action<string> {
    hash: string;
    cb: () => Promise<StrapiCacheCallReturnFragment[]>;
}

export const StrapiCacheNewCall = (hash: string, cb: () => Promise<StrapiCacheCallReturnFragment[]>): IStrapiCacheNewCall => ({
    type: StrapiCacheActions.NewCall,
    hash,
    cb
});

export interface IStrapiCacheSetRequired extends Action<string> {
    hash: string;
}

export const StrapiCacheSetRequired = (hash: string): IStrapiCacheSetRequired => ({
    type: StrapiCacheActions.SetRequired,
    hash
});

export interface IStrapiCacheSetHeight extends Action<string> {
    height: number;
}

export const StrapiCacheSetHeight = (height: number): IStrapiCacheSetHeight => ({
    type: StrapiCacheActions.SetHeight,
    height
});

export type StrapiCacheActionTypes = IStrapiCacheSetHeight | IStrapiCacheNewCall | IStrapiCacheSetRequired | IStrapiCacheSetData;

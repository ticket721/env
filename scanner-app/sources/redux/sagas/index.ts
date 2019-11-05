import { Saga }                             from '@redux-saga/types';
import { all, AllEffect, fork, ForkEffect } from 'redux-saga/effects';

import { DeviceSagas }                      from './device';
import { StatusSagas }                      from './status';
import { EventsSagas }                      from './events';
import { VerifiedTicketsSagas }             from './tickets';
import { ImagesSagas }                      from './images';

export default (): Saga => {

    const combination: Saga[] = [
        DeviceSagas,
        StatusSagas,
        EventsSagas,
        VerifiedTicketsSagas,
        ImagesSagas
    ];

    const merged_forked_sagas: ForkEffect[] = combination.map((saga: Saga): ForkEffect => fork(saga));

    return function* root(): IterableIterator<AllEffect<any>> {
        yield all(merged_forked_sagas);
    };

};

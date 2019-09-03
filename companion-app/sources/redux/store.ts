import { createStore, Store, applyMiddleware } from 'redux';
import reducers                                from './reducers';
import sagas                                   from './sagas';
import { AppState }                            from 'react-native';
import createSagaMiddleware                    from 'redux-saga';

export const store = (): Store<AppState> => {
    const sagaMiddleware = createSagaMiddleware();
    const ret = createStore<AppState>(reducers, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(sagas());
    return ret;
};

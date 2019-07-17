import { Store }         from 'redux';
import '../misc/window';
import { Config, Start } from './app/actions';
import { AppConfig }     from './app_state';

/**
 * Sets the config for the App section and start the app
 *
 * @param store
 * @param config
 */
export const setupApp = (store: Store, config: AppConfig): void => {

    store.dispatch(Config(config));
    store.dispatch(Start());

};

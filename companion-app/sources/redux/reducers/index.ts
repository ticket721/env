import { combineReducers } from 'redux';
import { DeviceReducer }   from './device';
import { StatusReducer }   from './status';
import { TicketReducer }   from './tickets';
import { ImagesReducer }   from './images';
import { AppState }        from '../state';

/**
 * Combining reducer into one default export, matching the store general state
 */
export default combineReducers<AppState>({
    device: DeviceReducer,
    status: StatusReducer,
    tickets: TicketReducer,
    images: ImagesReducer
});

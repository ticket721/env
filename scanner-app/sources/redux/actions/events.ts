import { Action } from 'redux';
import { Event }  from '../state';

export const EventsActions = {
    GetEventInfos: '@@scanner/events/geteventinfos',
    AddEvent: '@@scanner/events/addevent',
    RemoveEvent: '@@scanner/events/removeevents',
    SetEvents: '@@scanner/events/setevents',
    RefreshEvents: '@@scanner/events/refreshevents'
};

export interface GetEventInfosAction extends Action <string> {
    event_address: string;
}

export interface AddEventAction extends Action<string> {
    event_infos: Event;
}

export interface RemoveEventAction extends Action<string> {
    event_id: number;
}

export interface SetEventsAction extends Action<string> {
    events: Event[];
}

export interface RefreshEventsAction extends Action<string> {
}

export const GetEventInfos = (event_address: string): GetEventInfosAction => ({
    type: EventsActions.GetEventInfos,
    event_address
});

export const AddEvent = (event_infos: Event): AddEventAction => ({
    type: EventsActions.AddEvent,
    event_infos
});

export const RemoveEvent = (event_id: number): RemoveEventAction => ({
    type: EventsActions.RemoveEvent,
    event_id
});

export const SetEvents = (events: Event[]): SetEventsAction => ({
    type: EventsActions.SetEvents,
    events
});

export const RefreshEvents = (): RefreshEventsAction => ({
    type: EventsActions.RefreshEvents
});

export type EventsActionsType =
    GetEventInfosAction
    | AddEventAction
    | RemoveEventAction
    | SetEventsAction;

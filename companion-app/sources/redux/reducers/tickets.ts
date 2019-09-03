import { Reducer }                                                             from 'redux';
import { TicketState, initialState }                                           from '../state';
import { LinkedAndReadyAction, StartAction, StatusActions, StatusActionsType } from '../actions/status';
import { SetTicketsAction, TicketsActions, TicketsActionsType }                from '../actions/tickets';

const StatusStartReducer: Reducer<TicketState, StartAction> = (state: TicketState, action: StartAction): TicketState =>
    initialState.tickets;

const TicketsSetTicketsReducer: Reducer<TicketState, SetTicketsAction> = (state: TicketState, action: SetTicketsAction): TicketState => action.tickets;

const StatusLinkedAndReadyReducer: Reducer<TicketState, LinkedAndReadyAction> = (state: TicketState, action: LinkedAndReadyAction): TicketState => action.tickets;

/**
 * Main Reducer of the Ticket Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const TicketReducer: Reducer<TicketState, any> = (state: TicketState = initialState.tickets, action: TicketsActionsType | StatusActionsType): TicketState => {
    switch (action.type) {
        case StatusActions.Start:
            return StatusStartReducer(state, action);
        case TicketsActions.SetTickets:
            return TicketsSetTicketsReducer(state, action as SetTicketsAction);
        case StatusActions.LinkedAndReady:
            return StatusLinkedAndReadyReducer(state, action as LinkedAndReadyAction);
        default:
            return state;
    }
};

import { Action } from 'redux';
import { Ticket } from '../state';

export const TicketsActions = {
    SetTickets: '@@companion/tickets/settickets',
    RefreshTickets: '@@companion/tickets/refreshtickets'
};

export interface SetTicketsAction extends Action<string> {
    owner: string;
    tickets: Ticket[];
}

export interface RefreshTicketsAction extends Action<string> {
}

export const SetTickets = (owner: string, tickets: Ticket[]): SetTicketsAction => ({
    type: TicketsActions.SetTickets,
    owner,
    tickets
});

export const RefreshTickets = (): RefreshTicketsAction => ({
    type: TicketsActions.RefreshTickets
});

export type TicketsActionsType = SetTicketsAction;

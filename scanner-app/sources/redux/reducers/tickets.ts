import { Reducer }                                                          from 'redux';
import { SetVerifiedTicketListAction, TicketsActionsType, TicketActions }   from '../actions/tickets';
import { VerifiedTicketState, initialState }                                from '../state';

const SetVerifiedTicketListReducer: Reducer<VerifiedTicketState, SetVerifiedTicketListAction> =
    (state: VerifiedTicketState, action: SetVerifiedTicketListAction): VerifiedTicketState => action.tickets;

/**
 * Main Reducer of the Verified Tickets Section
 *
 * @param state
 * @param action
 * @constructor
 */
export const TicketReducer: Reducer<VerifiedTicketState, TicketsActionsType> =
    (state: VerifiedTicketState = initialState.verified_tickets, action: TicketsActionsType): VerifiedTicketState => {
        switch (action.type) {
            case TicketActions.SetVerifiedTicketList:
                return SetVerifiedTicketListReducer(state, action as SetVerifiedTicketListAction);
            default:
                return state;
        }
};

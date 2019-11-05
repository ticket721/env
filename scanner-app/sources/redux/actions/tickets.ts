import { Action }             from 'redux';
import { Ticket, UserInfos }  from '../state';

export const TicketActions = {
    VerifyTicketQRCode: '@@scanner/device/verifyticketqrcode',
    AddVerifiedTicket: '@@scanner/device/addverifiedticket',
    RemoveVerifiedTicket: '@@scanner/device/removeverifiedticket',
    SetVerifiedTicketList: '@@scanner/device/setverifiedticketlist',
    UpdateVerifiedTicketList: '@@scanner/device/updateverifiedticketlist'
};

export interface VerifyTicketQRCodeAction extends Action<string> {
    timestamp: number;
    ticket_id: number;
    signature: string;
}

export interface AddVerifiedTicketAction extends Action<string> {
    owner: UserInfos;
    ticket_id: number;
    timestamp: number;
}

export interface RemoveVerifiedTicketAction extends Action<string> {
    ticket_id: number;
}

export interface SetVerifiedTicketListAction extends Action<string> {
    tickets: Ticket[];
}

export interface UpdateVerifiedTicketListAction extends Action<string> {
    tickets: Ticket[];
}

export const VerifyTicketQRCode = (timestamp: number, ticket_id: number, signature: string): VerifyTicketQRCodeAction => ({
    type: TicketActions.VerifyTicketQRCode,
    timestamp,
    ticket_id,
    signature
});

export const AddVerifiedTicket = (owner: UserInfos, ticket_id: number, timestamp: number): AddVerifiedTicketAction => ({
    type: TicketActions.AddVerifiedTicket,
    owner,
    ticket_id,
    timestamp
});

export const RemoveVerifiedTicket = (ticket_id: number): RemoveVerifiedTicketAction => ({
    type: TicketActions.RemoveVerifiedTicket,
    ticket_id
});

export const SetVerifiedTicketList = (tickets: Ticket[]): SetVerifiedTicketListAction => ({
    type: TicketActions.SetVerifiedTicketList,
    tickets
});

export const UpdateVerifiedTicketList = (tickets: Ticket[]): UpdateVerifiedTicketListAction => ({
    type: TicketActions.UpdateVerifiedTicketList,
    tickets
});

export type TicketsActionsType =
    VerifyTicketQRCodeAction
    | AddVerifiedTicketAction
    | RemoveVerifiedTicketAction
    | SetVerifiedTicketListAction
    | UpdateVerifiedTicketListAction;

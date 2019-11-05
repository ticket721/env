import { RxDBEvent }            from '../RxDBStoreType';
import { Ticket, UserInfos }    from '../../redux/state';

export interface VerifiedTickets {
    event_id: number;
    tickets: Ticket[];
}

export abstract class ScannerServerLink {
    /**
     * Check if address is owner of ticket
     */
    abstract check_owner: (strapi_url: string, event_id: number, companion_address: string, ticket_id: number) => Promise<UserInfos | string>;

    /**
     * Get infos of an event from address
     */
    abstract get_event_by_address: (strapi_url: string, address: string) => Promise<RxDBEvent>;

    /**
     * Get infos of an event from event_id
     */
    abstract get_state: (strapi_url: string, idToTickets: VerifiedTickets[]) => Promise<RxDBEvent[]>;
}

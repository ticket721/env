import { Ticket } from '../../redux/state';

export interface ServerState {
    linked: boolean;
    linked_to: string;
    tickets: Ticket[];
}

export abstract class CompanionServerLink {

    /**
     * Issues code from the server
     */
    abstract issue_code: (strapi_url: string, device_identifier: string, timestamp: number, signature: string) => Promise<string>;

    /**
     * Get companion state from the server
     */
    abstract get_state: (strapi_url: string, device_identifier: string, timestamp: number, signature: string) => Promise<ServerState>;

}

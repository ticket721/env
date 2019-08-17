export interface StrapiAddress {
    id: number;
    address: string;
    admin: boolean;
    event: boolean;
    companion: boolean;

    actions_by: any[];
    actions_to: any[];
    tickets: any[];
    events: any[];
    queuedevents: any[];
    issued: any[];
    linked_event: any;
    linked_wallet: any;
    linked_companion: any;
    username: string;
}

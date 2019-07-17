export interface StrapiAddress {
    id: number;
    address: string;
    admin: boolean;
    event: boolean;

    actions_by: any[];
    actions_to: any[];
    tickets: any[];
    events: any[];
    queuedevents: any[];
    issued: any[];
    linked_event: any;
    username: string;
}

import { CompanionCore } from '../core/CompanionCore';

export interface Image {
    uri_source: string;
}

export interface Address {
    address: string;
}

export interface Event {
    address: Address;
    name: string;
    banners: any[];
    image: any;
    creation: string;
    description: string;
    end: string;
    eventcontract: number;
    id: number;
    location: string;
    owner: number;
    start: string;
}

export interface Ticket {
    ticket_id: number;
    id: number;
    mint_block: number;
    creation: number;
    mint_price: string;
    mint_currency: string;
    owner: string;
    event: Event;
}

export const strapiToTicket = (ticket: any): Ticket =>
    ({
        ticket_id: ticket.ticket_id,
        id: ticket.id,
        mint_block: ticket.mint_block,
        creation: new Date(ticket.creation).valueOf(),
        mint_price: ticket.mint_price,
        mint_currency: ticket.mint_currency,
        owner: ticket.owner.address,
        event: {
            address: ticket.event.address,
            name: ticket.event.name,
            banners: ticket.event.banners,
            image: ticket.event.image,
            creation: ticket.event.creation,
            description: ticket.event.description,
            end: ticket.event.end,
            eventcontract: ticket.event.eventcontract,
            id: ticket.event.id,
            location: ticket.event.location,
            owner: ticket.event.owner,
            start: ticket.event.start
        }
    });

export type DeviceIdentifier = string;

export interface NetworkInfos {
    name: string;
    strapi_url: string;
    eth_node_url: string;
    linked_to: string;
    link_code: string;
}

export interface Message {
    value: string;
    message_type: string;
}

/**
 * State of the Device Section
 */
export interface DeviceState {
    device_identifier: DeviceIdentifier;
    strapi_url: string;
    eth_node_url: string;
    current_network: string;
    core: CompanionCore;
    network_list: NetworkInfos[];
    messages: Message[];
    shown_messages: number;
    refreshing: boolean;
    current_qr: {
        source: string;
        ticket: number;
        timestamp: number;
    };
    current_ticket: number;
}

/**
 * State of the Ticket section
 */
export type TicketState = Ticket[];

/**
 * State of the Status section
 */
export enum StatusState {
    Loading = 0,
    BootNetworkChoice,
    DeviceReady,
    NotLinked,
    LinkedAndReady
}

export type ImagesState = {
    [key: string]: {
        sources: Image;
        loading: boolean;
    }
};

/**
 * Global Application State
 */
export interface AppState {
    tickets: TicketState;
    device: DeviceState;
    status: StatusState;
    images: ImagesState;
}

export const initialState: AppState = {
    tickets: [],
    device: {
        device_identifier: null,
        strapi_url: null,
        eth_node_url: null,
        current_network: null,
        core: null,
        network_list: [],
        messages: [],
        shown_messages: 0,
        refreshing: false,
        current_qr: {
            source: null,
            ticket: null,
            timestamp: null
        },
        current_ticket: null
    },
    images: {},
    status: StatusState.Loading
};

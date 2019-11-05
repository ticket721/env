import { ScannerCore }  from '../core/ScannerCore';

export interface Image {
    uri_source: string;
}

export interface UserInfos {
    username: string;
    user_id: number;
}

export interface Ticket {
    ticket_id: number;
    owner: UserInfos;
    timestamp: number;
}

export interface Event {
    address: string;
    name: string;
    banners: any[];
    image: any;
    description: string;
    end: string;
    id: number;
    location: string;
    // owner: number;
    start: string;
    verified_tickets: Ticket[];
}

export const strapiToEvent = (event: any, address: string, tickets: Ticket[] = []): Event =>
    ({
        address: address,
        name: event.name,
        banners: event.banners,
        image: event.image,
        description: event.description,
        end: event.end,
        id: event.id,
        location: event.location.label,
        start: event.start,
        verified_tickets: tickets
    });

export interface NetworkInfos {
    name: string;
    strapi_url: string;
    eth_node_url: string;
}

export interface Message {
    value: string;
    message_type: string;
}

/**
 * State of the Device Section
 */
export interface DeviceState {
    strapi_url: string;
    eth_node_url: string;
    current_network: string;
    core: ScannerCore;
    network_list: NetworkInfos[];
    message: Message;
    shown_messages: number;
    refreshing: boolean;
    current_event: number;
    onScan: boolean;
    scanResult: string;
}

/**
 * State of the Event section
 */
export type EventState = Event[];

/**
 * State of the Verified Tickets section
 */
export type VerifiedTicketState = Ticket[];

/**
 * State of the Status section
 */
export enum StatusState {
    Loading = 0,
    BootNetworkChoice,
    DeviceReady
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
    events: EventState;
    verified_tickets: VerifiedTicketState;
    device: DeviceState;
    status: StatusState;
    images: ImagesState;
}

export const initialState: AppState = {
    events: [],
    verified_tickets: [],
    device: {
        strapi_url: null,
        eth_node_url: null,
        current_network: null,
        core: null,
        network_list: [],
        message: null,
        shown_messages: 0,
        refreshing: false,
        current_event: null,
        onScan: false,
        scanResult: null
    },
    images: {},
    status: StatusState.Loading
};

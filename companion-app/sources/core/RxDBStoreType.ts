import { Ticket } from '../redux/state';

export type RxDBTicket = Ticket;

export interface RxDBNetwork {
    tickets: RxDBTicket[];
    name: string;
    strapi_url: string;
    eth_node_url: string;
    linked_to: string;
}

export interface RxDBStore {
    wallet: string;
    device_identifier: string;
    networks: RxDBNetwork[];
    selected_network: string;
}

export const initial_store = {
    wallet: null,
    device_identifier: null,
    networks: [
        {
            name: 'Mainnet',
            strapi_url: 'https://api.ticket721.com',
            eth_node_url: 'https://geth.ticket721.com',
            tickets: [null],
            linked_to: null
        },
        {
            name: 'Rinkeby',
            strapi_url: 'https://api.rinkeby.ticket721.com',
            eth_node_url: 'https://geth.rinkeby.ticket721.com',
            tickets: [null],
            linked_to: null
        }
    ],
    selected_network: 'Rinkeby'
};

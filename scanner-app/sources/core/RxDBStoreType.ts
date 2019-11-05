import { Event } from '../redux/state';

export type RxDBEvent = Event;

export interface  RxDBNetwork {
    events: RxDBEvent[];
    name: string;
    strapi_url: string;
    eth_node_url: string;
}

export interface RxDBStore {
    networks: RxDBNetwork[];
    selected_network: string;
}

export const initial_store = {
    networks: [
        {
            name: 'Mainnet',
            strapi_url: 'https://api.ticket721.com',
            eth_node_url: 'https://geth.ticket721.com',
            events: [null]
        },
        {
            name: 'Rinkeby',
            strapi_url: 'https://api.rinkeby.ticket721.com',
            eth_node_url: 'https://geth.rinkeby.ticket721.com',
            events: [null]
        }
    ],
    selected_network: 'Rinkeby'
};

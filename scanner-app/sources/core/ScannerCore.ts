import { log }                                              from './log';
import { RxDBNetwork, RxDBStore, RxDBEvent }                from './RxDBStoreType';
import { ScannerStorage }                                   from './ScannerStorage/ScannerStorage';
import { ScannerServerLink, VerifiedTickets }               from './ScannerServerLink/ScannerServerLink';
import { Image, NetworkInfos, Event, Ticket, UserInfos }    from '../redux/state';
import { TicketProof }                                      from './TicketProof/TicketProof';
import Strapi                                               from 'strapi-sdk-javascript';

export class ScannerCore {

    storage: ScannerStorage;
    link: ScannerServerLink;
    tp: TicketProof;

    /**
     * Built with builders in order to keep a high dependency breaking
     *
     * @param storage_builder
     */
    constructor(storage_builder: () => ScannerStorage,
                link_builder: () => ScannerServerLink,
                tp_builder: () => TicketProof) {
        this.storage = storage_builder();
        this.link = link_builder();
        this.tp = tp_builder();
    }

    /**
     * Completely resets the ScannerStorage module
     */
    public clearStorage = async (): Promise<void> => {
        await this.storage.clear();
    }

    /**
     * Setups the ScannerStorage module
     */
    public setupStorage = async (arg: any): Promise<void> => {
        await this.storage.setup(arg);
    }

    /**
     * Add a Network to the Scanner. Updates ScannerStorage store.
     */
    public addNetwork = async (net_name: string, strapi_url: string, eth_node_url: string): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::addNetwork] cannot add network without storage setup');

        if (store.networks.findIndex((net: RxDBNetwork): boolean => net.name === net_name) !== -1) {
            log.error(`[ScannerCore::addNetwork] cannot add network with name ${net_name}: already exists`);
            throw new Error(`[ScannerCore::addNetwork] cannot add network with name ${net_name}: already exists`);
        }

        const nets = store.networks.concat([{
            name: net_name,
            eth_node_url,
            strapi_url,
            events: [null]
        }]);

        await this.storage.update({
            networks: nets
        });

        log.info(`[ScannerCore::addNetwork] added networks ${net_name}`);
    }

    /**
     * Remove a Network from the Scanner. Updates ScannerStorage store.
     */
    public removeNetwork = async (net_name: string): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::addNetwork] cannot add network without storage setup');

        const net_idx = this.evaluateNet(store.networks, net_name,
            `[ScannerCore::removeNetwork] cannot remove network with name ${net_name}: no such network`);

        const nets = store.networks.slice(0, net_idx).concat(store.networks.slice(net_idx + 1));

        await this.storage.update({
            networks: nets
        });

        if (net_name === store.selected_network) {
            await this.setNetwork(null);
        }

    }

    /**
     * Selects a network to be used. Updates ScannerStorage store.
     */
    public setNetwork = async (net_name: string): Promise<void> => {

        if (net_name === null) {
            return await this.storage.update({
                selected_network: null
            });
        }

        const nets = await this.getNetworks();

        this.evaluateNet(nets, net_name,
            `[ScannerCore::setNetwork] cannot set network ${net_name}: unknown network`);

        return await this.storage.update({
            selected_network: net_name
        });
    }

    /**
     * Setups the Network informations. Returns true if everything is ok, false if network selection is required.
     */
    public setupNetwork = async (): Promise<boolean> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::setupNetwork] cannot setup network with empty store');

        if (store.selected_network === null || store.selected_network === undefined) {
            log.info('[ScannerCore::setupNetwork] no network selected');
            return false;
        } else {

            const selected_idx = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === store.selected_network);

            if (selected_idx === -1) {
                log.warn('[ScannerCore::setupNetwork] invalid network selected');
                await this.setNetwork(null);
                return false;
            }

            return true;
        }
    }

    /**
     * Recover a list of stored networks.
     */
    public getNetworks = async (): Promise<NetworkInfos[]> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getNetworks] cannot get networks with empty store');

        return store.networks.map((network: RxDBNetwork): NetworkInfos =>
            ({
                name: network.name,
                strapi_url: network.strapi_url,
                eth_node_url: network.eth_node_url
            }));
    }

    /**
     * Recover the currently selected network.
     */
    public getSelectedNetwork = async (): Promise<string> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getSelectedNetwork] cannot get selected network with empty store');

        return store.selected_network;
    }

    /**
     * Ping server
     */
    public pingServer = async (): Promise<boolean> => {
        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getEventInfos] cannot get event infos with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::getEventInfos] cannot add event with no selected network');

        const strapi_url = store.networks[net_idx].strapi_url;

        const strapi = new Strapi(strapi_url);

        try {

            await strapi.request('get', '');
            return true;

        } catch (e) {
            log.error(e);
            return false;
        }
    }

    /**
     * get event infos from server for the given address
     * 
     * @param address
     */
    public getEventInfos = async (address: string): Promise<RxDBEvent> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getEventInfos] cannot get event infos with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::getEventInfos] cannot add event with no selected network');

        const strapi_url = store.networks[net_idx].strapi_url;

        const strapi_res = await this.link.get_event_by_address(strapi_url, address);

        if (strapi_res === null) {
            log.error('[ScannerCore:getEventInfos] This event does not exist');
            throw new Error('[ScannerCore:getEventInfos] This event does not exist');
        }
        
        return strapi_res;
    }

    /**
     * Add a new event to the current network
     *
     * @param event_infos
     */
    public addEvent = async (event_infos: Event): Promise<void> => {
        
        const store: RxDBStore = await this.evaluateStore('[ScannerCore::addEvent] cannot add event with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::addEvent] cannot add event with no selected network');

        const nets: RxDBNetwork[] = store.networks;

        const event = {
            address: event_infos.address,
            id: event_infos.id,
            name: event_infos.name,
            description: event_infos.description,
            location: event_infos.location,
            start: event_infos.start,
            end: event_infos.end,
            image: event_infos.image,
            banners: event_infos.banners,
            verified_tickets: event_infos.verified_tickets
        };
        if (nets[net_idx].events[0] === null) {
            nets[net_idx].events = [event];
        } else {
            nets[net_idx].events = nets[net_idx].events.concat([event]);
        }

        await this.storage.update({
            networks: nets
        });

        log.info(`[ScannerCore::addEvent] added event ${event_infos.name}`);
    }

    /**
     * Remove an event from the current network
     * 
     * @param event_id
     */
    public removeEvent = async (event_id: number): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::removeEvent] cannot remove event with empty store');

        const nets: RxDBNetwork[] = store.networks;

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::removeEvent] cannot remove event with no selected network');

        const event_idx = this.evaluateEvent(nets[net_idx].events, event_id,
            '[ScannerCore::removeEvent] cannot remove nonexistent event');

        nets[net_idx].events = nets[net_idx].events
                                    .slice(0, event_idx)
                                    .concat(nets[net_idx].events.slice(event_idx + 1));

        await this.storage.update({
            networks: nets
        });
    }

    /**
     * Recover the list of events for the provided network
     *
     * @param net_name
     */
    public getEvents = async (net_name: string): Promise<Event[]> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getEvents] cannot get events with empty store');

        const net_idx = this.evaluateNet(store.networks, net_name,
            '[ScannerCore::getEvents] cannot get events of unknown network');

        return store.networks[net_idx].events;
    }

    /**
     * Request all added events from strapi
     */
    public refreshEvents = async (): Promise<Event[]> => {
        
        const store: RxDBStore = await this.evaluateStore('[ScannerCore::refreshEvents] cannot refresh events infos with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::refreshEvents] cannot refresh events with no selected network');

        const events = store.networks[net_idx].events;

        const ticketsByEventId: VerifiedTickets[] = [];

        if (events.length > 0 && events[0] !== null) {

            for (let i = 0; i < events.length; i++) {
                ticketsByEventId[i] = {
                    event_id: events[i].id,
                    tickets: events[i].verified_tickets
                };
            }

            const strapi_url = store.networks[net_idx].strapi_url;

            const strapi_res = await this.link.get_state(strapi_url, ticketsByEventId);

            return strapi_res;
        }

        return events;
    }

    /**
     * Recover the Scanner events from the current network
     */
    public getSavedEvents = async (): Promise<RxDBEvent[]> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getSavedState] cannot get saved state with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::getSavedState] cannot get saved events with no selected network');

        return store.networks[net_idx].events;
    }

    /**
     * Set events for the currently selected network.
     *
     * @param events
     */
    public setEvents = async (events: Event[]): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::setEvents] cannot set events with empty store');

        const nets: RxDBNetwork[] = store.networks;

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::setEvents] cannot set events with no selected network');

        nets[net_idx].events = events;

        await this.storage.update({
            networks: nets
        });
    }

    /**
     * Use timestamp ticket_id and signature in order to verify if the companion
     * address linked match the scanned ticket owner.
     *
     * @param timestamp
     * @param ticket_id
     * @param signature
     */
    public checkOwnedTicket = async (timestamp: number, event_id: number, ticket_id: number, signature: string): Promise<UserInfos | string> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getTicketProof] cannot check ticket owner with empty store');

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::setEvents] cannot check ticket owner with no selected net');

        const strapi_url = store.networks[net_idx].strapi_url;
        
        const companion_address = await this.tp.verifyProof(timestamp, ticket_id, signature);
        
        const strapi_res = await this.link.check_owner(strapi_url, event_id, companion_address, ticket_id);

        return strapi_res;
    }

    /**
     * Add a new verified ticket to the provided event
     *
     * @param event_id
     * @param ticket_infos
     */
    public addVerifiedTicket = async (event_id: number, ticket_infos: Ticket): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::addVerifiedTicket] cannot add verified ticket with empty store');

        const nets: RxDBNetwork[] = store.networks;

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::addVerifiedTicket] cannot add verified ticket to unknown network');

        const event_idx = this.evaluateEvent(nets[net_idx].events, event_id,
            '[ScannerCore::addVerifiedTicket] cannot add verified ticket to nonexistent event');

        nets[net_idx].events[event_idx].verified_tickets =
            nets[net_idx].events[event_idx].verified_tickets.concat([{
                ticket_id: ticket_infos.ticket_id,
                owner: ticket_infos.owner,
                timestamp: ticket_infos.timestamp
            }]);

        await this.storage.update({
            networks: nets
        });

        log.info(`[ScannerCore::addVerifiedTicket] added verified ticket ${ticket_infos.ticket_id}`);
    }

    /**
     * Remove a ticket from the provided event
     * 
     * @param event_id
     * @param ticket_id
     */
    public removeVerifiedTicket = async (event_id: number, ticket_id: number): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::removeVerifiedTicket] cannot remove verified ticket with empty store');

        const nets: RxDBNetwork[] = store.networks;

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::removeVerifiedTicket] cannot remove verified ticket from unknown network');

        const event_idx = this.evaluateEvent(nets[net_idx].events, event_id,
            '[ScannerCore::removeVerifiedTicket] cannot remove verified ticket from nonexistent event');

        const ticket_idx = nets[net_idx].events[event_idx].verified_tickets.findIndex((ticket: Ticket): boolean => ticket.ticket_id === ticket_id);

        if (ticket_idx === -1) {
            log.error('[ScannerCore::removeVerifiedTicket] cannot remove nonexistent verified ticket');
            throw new Error('[ScannerCore::removeVerifiedTicket] cannot remove nonexistent verified ticket');
        }

        nets[net_idx].events[event_idx].verified_tickets =
            nets[net_idx].events[event_idx].verified_tickets
                .slice(0, ticket_idx)
                .concat(nets[net_idx].events[event_idx].verified_tickets.slice(ticket_idx + 1));

        await this.storage.update({
            networks: nets
        });
    }

    /**
     * Recover the list of verified tickets for the provided event
     *
     * @param event_id
     */
    public getVerifiedTickets = async (event_id: number): Promise<Ticket[]> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::getVerifiedTickets] cannot get verified tickets with empty store');

        const nets: RxDBNetwork[] = store.networks;
        
        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::getVerifiedTickets] cannot get verified tickets of unknown network');

        const event_idx = this.evaluateEvent(nets[net_idx].events, event_id,
            '[ScannerCore::getVerifiedTickets] cannot get verified tickets of nonexistent event');

        return nets[net_idx].events[event_idx].verified_tickets;
    }

    /**
     * Sets verified tickets for the provided event.
     *
     * @param event_id
     * @param tickets
     */
    public updateVerifiedTickets = async (event_id: number , tickets: Ticket[]): Promise<void> => {

        const store: RxDBStore = await this.evaluateStore('[ScannerCore::setVerifiedTickets] cannot set verified tickets with empty store');

        const nets: RxDBNetwork[] = store.networks;

        const net_idx = this.evaluateNet(store.networks, store.selected_network,
            '[ScannerCore::setVerifiedTickets] cannot set verified tickets with no selected net');

        const event_idx = this.evaluateEvent(nets[net_idx].events, event_id,
            '[ScannerCore::setVerifiedTickets] cannot set verified tickets of nonexistent event');
        
        nets[net_idx].events[event_idx].verified_tickets = tickets;

        await this.storage.update({
            networks: nets
        });
    }

    private readonly toDataUrl = async (url: string): Promise<string> =>
        /* istanbul ignore next */
        new Promise<string>((ok: any, ko: any): void => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function (): void {
                const reader = new FileReader();
                reader.onloadend = function (): void {
                    ok(reader.result);
                };
                reader.onerror = ko;
                reader.onabort = ko;
                if (xhr.status >= 400) {
                    return ko(xhr);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = ko;
            xhr.ontimeout = ko;
            xhr.onabort = ko;
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        })

    /**
     * Store B64 source of image under its identifier hash
     *
     * @param sources
     * @param hash
     */
    private readonly storeImage = async (sources: string, hash: string): Promise<void> => {

        try {
            await this.storage.store_image({
                uri_source: sources
            }, hash);
        } catch (e) {
            return this.storeImage(sources, hash);
        }

    }

    /**
     * Recovers image from internal storage or fetches it
     *
     * @param hash
     * @param url
     */
    public getImage = async (hash: string, url: string): Promise<Image> => {
        const img: Image = await this.storage.get_image(hash);

        if (img === null) {

            if (!!process.env.MOCHA_TESTING) {
                const sources = 'testing_sources';
                await this.storeImage(sources, hash);
                return {
                    uri_source: sources
                };
            }

            try {

                /* istanbul ignore next */
                const sources = await this.toDataUrl(url);
                /* istanbul ignore next */
                await this.storeImage(sources, hash);
                /* istanbul ignore next */
                return {
                    uri_source: sources
                };

            } catch {
                /* istanbul ignore next */
                return null;
            }
        }

        return img;
    }

    private readonly evaluateStore = async (errorMessage: string): Promise<RxDBStore> => {
        const store: RxDBStore = await this.storage.get();

        if (!store) {
            log.error(errorMessage);
            throw new Error(errorMessage);
        }

        return store;
    }

    private readonly evaluateNet = (networks: RxDBNetwork[] | NetworkInfos[], net_name: string, errorMessage: string): number => {
        const net_idx: number = networks.findIndex((net: RxDBNetwork | NetworkInfos): boolean => net.name === net_name);

        if (net_idx === -1) {
            log.error(errorMessage);
            throw new Error(errorMessage);
        }

        return net_idx;
    }

    private readonly evaluateEvent = (events: RxDBEvent[], event_id: number, errorMessage: string): number => {
        const event_idx: number = events.findIndex((event: RxDBEvent): boolean => event.id === event_id);

        if (event_idx === -1) {
            log.error(errorMessage);
            throw new Error(errorMessage);
        }

        return event_idx;
    }
}

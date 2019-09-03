import { log }                                         from './log';
import { RxDBNetwork, RxDBStore }                      from './RxDBStoreType';
import { CompanionStorage }                            from './CompanionStorage/CompanionStorage';
import { CompanionIdentifierRetriever }                from './CompanionIdentifierRetriever/CompanionIdentifierRetriever';
import { CompanionWallet }                             from './CompanionWallet/CompanionWallet';
import { Image, NetworkInfos, strapiToTicket, Ticket } from '../redux/state';
import { CompanionServerLink, ServerState }            from './CompanionServerLink/CompanionServerLink';

/**
 * Core mechanisms of the Companion App. Called from redux sagas almost all the time
 */
export class CompanionCore {

    storage: CompanionStorage;
    identifier_retriever: CompanionIdentifierRetriever;
    wallet: CompanionWallet;
    link: CompanionServerLink;

    /**
     * Built with builders in order to keep a high dependency breaking
     *
     * @param storage_builder
     * @param identifier_retriever_builder
     * @param wallet_builder
     * @param link_builder
     */
    constructor(storage_builder: () => CompanionStorage,
                identifier_retriever_builder: () => CompanionIdentifierRetriever,
                wallet_builder: () => CompanionWallet,
                link_builder: () => CompanionServerLink) {
        this.storage = storage_builder();
        this.identifier_retriever = identifier_retriever_builder();
        this.wallet = wallet_builder();
        this.link = link_builder();
    }

    /**
     * Completely resets the CompanionStorage module
     */
    public clearStorage = async (): Promise<void> => {
        await this.storage.clear();
    }

    /**
     * Setups the CompanionStorage module
     */
    public setupStorage = async (arg: any): Promise<void> => {
        await this.storage.setup(arg);
    }

    /**
     * Setups the CompanionWallet module. Should be called after setting up the CompanionStorage module.
     */
    public setupWallet = async (): Promise<void> => {
        const store = await this.storage.get();

        if (!store) {
            log.error('[CompanionCore::setupWallet] cannot setup wallet with empty store');
            throw new Error('[CompanionCore::setupWallet] cannot setup wallet with empty store');
        }

        if (!store.wallet) {
            log.info('[CompanionCore::setupWallet] no existing wallet, creating');

            const ethw = await this.wallet.generate();

            /* istanbul ignore next */
            if (!process.env.MOCHA_TESTING) {
                // Adding friction to wallet creation gives more value to what is being generated
                /* istanbul ignore next */
                await new Promise((ok: any, ko: any): void => {
                    setTimeout(ok, 5000);
                });
            }

            await this.storage.update({
                wallet: ethw
            });

            log.info(`[CompanionCore::setupWallet] wallet created => ${await this.wallet.address(ethw)}`);
        } else {
            log.info(`[CompanionCore::setupWallet] wallet recovered => ${await this.wallet.address(store.wallet)}`);
        }
    }

    /**
     * Add a Network to the Companion. Updates CompanionStorage store.
     */
    public addNetwork = async (net_name: string, strapi_url: string, eth_node_url: string): Promise<void> => {
        const store: RxDBStore = await this.storage.get();

        if (!store) {
            log.error('[CompanionCore::addNetwork] cannot add network without storage setup');
            throw new Error('[CompanionCore::addNetwork] cannot add network without storage setup');
        }

        if (store.networks.findIndex((net: RxDBNetwork): boolean => net.name === net_name) !== -1) {
            log.error(`[CompanionCore::addNetwork] cannot add network with name ${net_name}: already exists`);
            throw new Error(`[CompanionCore::addNetwork] cannot add network with name ${net_name}: already exists`);
        }

        const nets = store.networks.concat([{
            name: net_name,
            eth_node_url,
            strapi_url,
            tickets: [null],
            linked_to: null
        }]);

        await this.storage.update({
            networks: nets
        });

        log.info(`[CompanionCore::addNetwork] added networks ${net_name}`);
    }

    /**
     * Remove a Network from the Companion. Updates CompanionStorage store.
     */
    public removeNetwork = async (net_name: string): Promise<void> => {

        const store: RxDBStore = await this.storage.get();

        if (!store) {
            log.error('[CompanionCore::addNetwork] cannot add network without storage setup');
            throw new Error('[CompanionCore::addNetwork] cannot add network without storage setup');
        }

        const net_idx = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === net_name);

        if (net_idx === -1) {
            log.error(`[CompanionCore::removeNetwork] cannot remove network with name ${net_name}: no such network`);
            throw new Error(`[CompanionCore::removeNetwork] cannot remove network with name ${net_name}: no such network`);
        }

        const nets = store.networks.slice(0, net_idx).concat(store.networks.slice(net_idx + 1));

        await this.storage.update({
            networks: nets
        });

        if (net_name === store.selected_network) {
            await this.setNetwork(null);
        }

    }

    /**
     * Selects a network to be used. Updates CompanionStorage store.
     */
    public setNetwork = async (net_name: string): Promise<void> => {
        if (net_name === null) {
            return await this.storage.update({
                selected_network: null
            });
        }

        const nets = await this.getNetworks();

        const selected_idx = nets.findIndex((net: NetworkInfos): boolean => net.name === net_name);

        if (selected_idx !== -1) {
            return await this.storage.update({
                selected_network: net_name
            });
        } else {
            log.error(`[CompanionCore::setNetwork] cannot set network ${net_name}: unknown network`);
            throw new Error(`[CompanionCore::setNetwork] cannot set network ${net_name}: unknown network`);
        }
    }

    /**
     * Setups the CompanionDeviceIdentifier module. Should be called after setting up the CompanionStorage module.
     */
    public setupDeviceIdentifier = async (): Promise<boolean> => {
        const store = await this.storage.get();

        if (!store) {
            log.error('[CompanionCore::setupDeviceIdentifier] cannot setup device identifier with empty store');
            throw new Error('[CompanionCore::setupDeviceIdentifier] cannot setup device identifier with empty store');
        }

        const ID = await this.identifier_retriever.getIdentifier(store.wallet);

        if (store.device_identifier === null) {
            log.info(`[CompanionCore::setupDeviceIdentifier] loading identifier ${ID}`);

            /* istanbul ignore next */
            if (!process.env.MOCHA_TESTING) {
                // Adding friction to initial setup steps gives more value to the general process
                /* istanbul ignore next */
                await new Promise((ok: any, ko: any): void => {
                    setTimeout(ok, 5000);
                });
            }

            await this.storage.update({
                device_identifier: ID
            });

            return true;
        } else {
            if (store.device_identifier !== ID) {
                log.warn(`[CompanionCore::setupDeviceIdentifier] identifier mismatch (store) ${store.device_identifier} vs (current) ${ID}`);
                return false;
            }
            log.info(`[CompanionCore::setupDeviceIdentifier] identifier recovered => ${ID}`);
            return true;
        }

    }

    /**
     * Setups the Network informations. Returns true if everything is ok, false if network selection is required.
     */
    public setupNetwork = async (): Promise<boolean> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::setupNetwork] cannot setup network with empty store');
            throw new Error('[CompanionCore::setupNetwork] cannot setup network with empty store');
        }

        if (store.selected_network === null || store.selected_network === undefined) {
            log.info('[CompanionCore::setupNetwork] no network selected');
            return false;
        } else {

            const selected_idx = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === store.selected_network);

            if (selected_idx === -1) {
                log.warn('[CompanionCore::setupNetwork] invalid network selected');
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
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getNetworks] cannot get networks with empty store');
            throw new Error('[CompanionCore::getNetworks] cannot get networks with empty store');
        }

        return store.networks.map((network: RxDBNetwork): NetworkInfos =>
            ({
                name: network.name,
                strapi_url: network.strapi_url,
                eth_node_url: network.eth_node_url,
                linked_to: network.linked_to,
                link_code: null
            }));
    }

    /**
     * Recover the identifier of the currently selected network.
     */
    public getSelectedNetwork = async (): Promise<string> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getSelectedNetwork] cannot get selected network with empty store');
            throw new Error('[CompanionCore::getSelectedNetwork] cannot get selected network with empty store');
        }

        return store.selected_network;

    }

    /**
     * Recover the list of tickets for the provided network
     *
     * @param net_name
     */
    public getTickets = async (net_name: string): Promise<Ticket[]> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getTickets] cannot get tickets with empty store');
            throw new Error('[CompanionCore::getTickets] cannot get tickets with empty store');
        }

        const idx = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === net_name);

        if (idx === -1) {
            log.error('[CompanionCore::getTickets] cannot get tickets of unknown network');
            throw new Error('[CompanionCore::getTickets] cannot get tickets of unknown network');
        }

        return store.networks[idx].tickets;

    }

    /**
     * Retrieves the Device Identifier stored in the CompanionStorage module
     */
    public getDeviceID = async (): Promise<string> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getDeviceID] cannot get device identifier with empty store');
            throw new Error('[CompanionCore::getDeviceID] cannot get device identifier with empty store');
        }

        return store.device_identifier;
    }

    /**
     * Generates an authentication proof from the CompanionWallet module, returns timestamp and signature
     */
    public getAuthProof = async (): Promise<[number, string]> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getAuthProof] cannot get authentication proof with empty store');
            throw new Error('[CompanionCore::getAuthProof] cannot get authentication proof with empty store');
        }

        return this.wallet.generate_auth_proof(store.wallet, store.device_identifier);

    }

    /**
     * Contacts the server with the CompanionServerLink module to issue a link code
     */
    public issueCode = async (): Promise<string> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::issueCode] cannot issue code with empty store');
            throw new Error('[CompanionCore::issueCode] cannot issue code with empty store');
        }

        const proof = await this.getAuthProof();

        const current_network = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === store.selected_network);

        const strapi_url = store.networks[current_network].strapi_url;

        const code = await this.link.issue_code(strapi_url, store.device_identifier, proof[0], proof[1]);

        return code;
    }

    /**
     * Recovers the companion state stored inside the CompanionStorage module
     */
    public getSavedState = async (): Promise<ServerState> => {

        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getSavedState] cannot get saved state with empty store');
            throw new Error('[CompanionCore::getSavedState] cannot get saved state with empty store');
        }

        const current_network_idx = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === store.selected_network);

        const current_network: RxDBNetwork = store.networks[current_network_idx];

        return {
            linked_to: current_network.linked_to,
            linked: current_network.linked_to !== null,
            tickets: current_network.tickets
        };
    }

    /**
     * Contacts the server with the CompanionServerLink module to recover current companion state (linked ? tickets ?)
     */
    public getState = async (): Promise<ServerState> => {
        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getState] cannot get state with empty store');
            throw new Error('[CompanionCore::getState] cannot get state with empty store');
        }

        const proof = await this.getAuthProof();

        const current_network = store.networks.findIndex((net: RxDBNetwork): boolean => net.name === store.selected_network);

        const strapi_url = store.networks[current_network].strapi_url;

        const strapi_res = await this.link.get_state(strapi_url, store.device_identifier, proof[0], proof[1]);

        if (strapi_res === null) return null;

        return {
            linked_to: strapi_res.linked_to,
            linked: strapi_res.linked,
            tickets: strapi_res.tickets.map((ticket: any): Ticket => strapiToTicket(ticket))
        };

    }

    /**
     * Sets tickets for the currently selected network. Also sets owner
     *
     * @param owner
     * @param tickets
     */
    public setTickets = async (owner: string, tickets: Ticket[]): Promise<void> => {

        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::setTickets] cannot set tickets with empty store');
            throw new Error('[CompanionCore::setTickets] cannot set tickets with empty store');
        }

        const nets: RxDBNetwork[] = store.networks;
        const current = store.selected_network;

        const net_idx = nets.findIndex((net: RxDBNetwork): boolean => net.name === current);

        if (net_idx === -1) {
            log.error('[CompanionCore::setTickets] cannot set tickets with no selected net');
            throw new Error('[CompanionCore::setTickets] cannot set tickets with no selected net');
        }

        nets[net_idx].tickets = owner === null ? [null] : tickets;
        nets[net_idx].linked_to = owner;

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

    /**
     * Generate cryptographic proof of the provided ticket. Contains timestamp and id and serves to identify the current
     * companion address. Then Scanner will check address linked to companion to proceed.
     *
     * @param ticket_id
     */
    public getTicketProof = async (ticket_id: number): Promise<[number, string]> => {

        const store = await this.storage.get();
        if (!store) {
            log.error('[CompanionCore::getTicketProof] cannot get ticket proof with empty store');
            throw new Error('[CompanionCore::getTicketProof] cannot get ticket proof with empty store');
        }

        return this.wallet.generate_ticket_proof(store.wallet, ticket_id);
    }

}
